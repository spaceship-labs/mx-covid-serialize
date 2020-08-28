import ReadLines from 'n-readlines';
import moment from 'moment';
import fs from './fileHelper';
import queries from '../queries';
import govData from '../models/govData';

const agregate = (entry, currentData, date) => {
  const newData = { ...currentData };
  newData.total += 1;
  const fileDate = moment(date, 'DD-MM-YY');

  if (entry.RESULTADO === '1') {
    newData.confirmed += 1;
    if (entry.FECHA_DEF !== '9999-99-99' && entry.FECHA_DEF !== '') {
      newData.deaths += 1;
    } else {
      const start = moment(entry.FECHA_INGRESO);
      const daysDiff = fileDate.diff(start, 'days');
      if (daysDiff >= 14) newData.recoveries += 1;
      else newData.active += 1;
    }
  }
  if (entry.RESULTADO === '2') newData.negative += 1;

  if (entry.RESULTADO === '3') newData.suspicious += 1;

  return newData;
};

const agregateDataDay = (original, summary, date) => {
  const timeSeries = original.map((m) => {
    const itm = { ...m };
    if (typeof m.entries === 'undefined') itm.entries = {};
    const key = `${itm.entityCode}${itm.municipalityCode}`;
    itm.entries[date] = summary[key];
    return itm;
  });
  return timeSeries;
};

// Sums and counts each type of case *Active and Recovered data is not accurate needs to be checked
const summarizeCases = (entries, date) => {
  const municipalities = {};
  entries.forEach((entry) => {
    const compoundKey = `${entry.ENTIDAD_RES}${entry.MUNICIPIO_RES}`;
    if (!municipalities[compoundKey]) {
      municipalities[compoundKey] = {
        total: 0,
        suspicious: 0,
        confirmed: 0,
        deaths: 0,
        recoveries: 0,
        negative: 0,
        active: 0,
      };
    }
    municipalities[compoundKey] = agregate(entry, municipalities[compoundKey], date);
  });
  return municipalities;
};

const getUSPopulation = (csvEntries) => {
  const result = csvEntries.reduce((acc, it) => {
    const { countyFIPS: fips, population: popStr, State: state } = it;
    const population = parseInt(popStr, 10);

    const name = it['County Name'];

    return {
      ...acc,
      [fips]: {
        fips, name, state, population,
      },
    };
  }, {});

  return result;
};

const normalizeUSData = (csvEntries) => {
  const result = csvEntries.reduce((acc, it) => {
    // console.log(Object.entries(acc).length);
    const {
      // Useful keys
      FIPS,
      Lat,
      Long_,
      Population,
      Province_State: state,

      // Destructuring this keys so we can use the rest operator
      // to group all the days into one object
      UID,
      iso2,
      iso3,
      code3,
      Admin2,
      County_Region: cR,
      Combined_Key: cK,
      Country_Region: ccRR,

      // Object with the days as keys and amount of cases as values
      ...days
    } = it;

    const lat = parseFloat(Lat);
    const lon = parseFloat(Long_);
    const population = parseInt(Population, 10);
    const fips = FIPS.replace('.0', '');

    // Most Complex Alternative to destructuring and rest operator

    // const daysArr =
    // Object.keys(it).filter(k => k.match(^(1[0-2]|[1-9])\/([1-9]|([12]\d+)|(3[01]))\/20$);
    // const daysObj = daysArr.reduce((acc, d) => {
    //   const cases = it[d];
    //   return { ...acc, [d]: cases}
    // })

    return {
      ...acc,
      [fips]: {
        fips, lat, lon, population, state, entries: days,
      },
    };
  }, {});

  return result;
};

const generateUSTimeSeries = async (data) => {
  const usCounties = await fs.parseCSV('countiesfpis.csv');
  const { confirmed, deaths, population } = data;

  const result = usCounties.map((county) => {
    const { fips, county: name, state } = county;
    const confirmedCounty = confirmed[fips];
    const deathsCounty = deaths[fips];
    const populationCounty = population[fips];

    const confirmedDays = Object.keys(confirmedCounty.entries);
    const deathsDays = Object.keys(deathsCounty.entries);
    const daysToProcess = new Set([...confirmedDays, ...deathsDays]);
    // const setIterator = daysToProcess.values();
    const entries = {};

    daysToProcess.forEach((it) => {
      const conf = parseInt(confirmedCounty.entries[it], 10);
      const death = parseInt(deathsCounty.entries[it], 10);
      entries[it] = { confirmed: conf, deaths: death };
    });
    // for (const it of setIterator) {
    //   const conf = parseInt(confirmedCounty.entries[it], 10);
    //   const death = parseInt(deathsCounty.entries[it], 10);
    //   entries[it] = { confirmed: conf, deaths: death };
    // }

    return {
      fips,
      entries,
      name: populationCounty.name || name,
      lat: confirmedCounty.lat || deathsCounty.lat,
      lon: confirmedCounty.lon || deathsCounty.lon,
      population: deathsCounty.population || populationCounty.population,
      state: populationCounty.state || confirmedCounty.state || deathsCounty.state || state,
    };
  });

  return result;
};

function getStatus(statusData, fileDate) {
  const { resultado, fechaDefuncion, fechaIngreso } = statusData;
  const start = moment(fechaIngreso, 'YYYY-MM-DD');
  const daysDiff = fileDate.diff(start, 'days');
  switch (resultado) {
    case '2':
      return 'negative';
    case '3':
      return 'suspicious';
    default:
      if (fechaDefuncion) {
        return 'death';
      }
      return (daysDiff >= 14) ? 'recovery' : 'active';
  }
}

async function createRegistry(reg, fileDate) {
  const { resultado, fechaDefuncion, fechaIngreso } = reg;
  const statusData = { resultado, fechaDefuncion, fechaIngreso };
  const fechaAparicion = fileDate.format('YYYY-MM-DD');
  const status = getStatus(statusData, fileDate);

  const fechaConfirmacion = status === 'active'
    || status === 'death'
    || status === 'recovery'
    || status === 'negative'
    ? `${fechaAparicion}` : null;
  const fechaAlta = status === 'recovery' ? `${fechaAparicion}` : null;

  const newRegistry = {
    ...reg, status, fechaAparicion, fechaConfirmacion, fechaAlta,
  };

  try {
    await queries.govData.createRegistry(newRegistry);
  } catch (e) {
    console.log(e);
    console.error(`fileDate: ${fileDate} % idRegistro: ${reg.idRegistro} % params: ${JSON.stringify(newRegistry)}`);
  }

  return true;
}

async function updateRegistry(dbReg, reg, fileDate) {
  const { resultado, fechaDefuncion, fechaIngreso } = reg;
  const statusData = { resultado, fechaDefuncion, fechaIngreso };
  const newStatus = getStatus(statusData, fileDate);

  if (newStatus === dbReg.status) {
    return true;
  }

  const params = {};
  params.fechaAlta = newStatus === 'recovery' ? fileDate.format('YYYY-MM-DD') : dbReg.fechaAlta;
  params.fechaConfirmacion = newStatus === 'active' || newStatus === 'negative'
    ? fileDate.format('YYYY-MM-DD')
    : dbReg.fechaConfirmacion;
  params.fechaDefuncion = newStatus === 'death' ? reg.fechaDefuncion : dbReg.fechaDefuncion;

  params.status = newStatus;

  try {
    await queries.govData.updateRegistry({ ...params }, dbReg.id);
  } catch (e) {
    console.log(e);
    console.error(`fileDate: ${fileDate} % idRegistro: ${reg.idRegistro} % dbReg: ${dbReg.id} % params: ${JSON.stringify(params)}`);
  }

  return true;
}

async function processRegistry(reg, fileDate) {
  const dbReg = await queries.govData.getRegistry(reg);
  const res = !dbReg
    ? await createRegistry(reg, fileDate)
    : await updateRegistry(dbReg, reg, fileDate);
  return res;
}

async function processDay(day) {
  console.log('A process');
  console.log(day);
  const dateString = `20${day[0]}${day[1]}-${day[2]}${day[3]}-${day[4]}${day[5]}`;
  const fileDate = moment(dateString, 'YYYY-MM-DD');

  const reader = new ReadLines(`./data/source/csv/${day}`);
  let line;
  line = reader.next();
  line = reader.next();
  while (line) {
    const [
      fechaActualizacionStr,
      idRegistroStr,
      origenStr,
      sectorStr,
      entidadUMStr,
      sexoStr,
      entidadNacStr,
      entidadResStr,
      municipioResStr,
      tipoPacienteStr,
      fechaIngresoStr,
      fechaSintomasStr,
      fechaDefuncionStr,
      intubadoStr,
      neumoniaStr,
      edadStr,
      nacionalidad,
      embarazoStr,
      lenguaIndigenaStr,
      diabetesStr,
      epocStr,
      asmaStr,
      inmusuprStr,
      hipertensionStr,
      otraCompStr,
      cardiovascularStr,
      obesidadStr,
      renalCronicaStr,
      tabaquismoStr,
      otroCasoStr,
      resultado,
      migranteStr,
      paisNacionalidadStr,
      paisOrigenStr,
      uciStr,
    ] = line.toString('utf-8').split(',');

    const cleanFechaDefuncionStr = fechaDefuncionStr.replace(/"/g, '');
    const fechaDefuncion = cleanFechaDefuncionStr === '9999-99-99'
      || !fechaDefuncionStr
      ? null
      : moment(cleanFechaDefuncionStr, 'YYYY-MM-DD').format('YYYY-MM-DD');

    const registry = {
      fechaActualizacion: fechaActualizacionStr.replace(/"/g, ''),
      idRegistro: idRegistroStr.replace(/"/g, ''),
      origen: Number.parseInt(origenStr, 10),
      sector: Number.parseInt(sectorStr, 10),
      entidadUM: entidadUMStr.replace(/"/g, ''),
      sexo: sexoStr === '1' ? 'Masculino' : 'Femenino',
      entidadNac: entidadNacStr.replace(/"/g, ''),
      entidadRes: entidadResStr.replace(/"/g, ''),
      municipioRes: municipioResStr.replace(/"/g, ''),
      tipoPaciente: Number.parseInt(tipoPacienteStr, 10),
      fechaIngreso: fechaIngresoStr.replace(/"/g, ''),
      fechaSintomas: fechaSintomasStr.replace(/"/g, ''),
      intubado: intubadoStr === '1',
      neumonia: neumoniaStr === '1',
      edad: Number.parseInt(edadStr, 10),
      embarazo: embarazoStr === '1',
      lenguaIndigena: lenguaIndigenaStr === '1',
      diabetes: diabetesStr === '1',
      epoc: epocStr === '1',
      asma: asmaStr === '1',
      inmusupr: inmusuprStr === '1',
      hipertension: hipertensionStr === '1',
      otraComp: otraCompStr === '1',
      cardiovascular: cardiovascularStr === '1',
      obesidad: obesidadStr === '1',
      renalCronica: renalCronicaStr === '1',
      tabaquismo: tabaquismoStr === '1',
      otroCaso: otroCasoStr === '1',
      migrante: Number.parseInt(migranteStr, 10),
      paisNacionalidad: paisNacionalidadStr.replace(/"/g, ''),
      paisOrigen: paisOrigenStr.replace(/"/g, ''),
      uci: uciStr === '1',
      resultado,
      nacionalidad,
      fechaDefuncion,
    };
    const a = await processRegistry(registry, fileDate);
    line = reader.next();
  }

  return true;
}

async function saveProcessed(dateStr) {
  const municipalities = await queries.municipalities.getAll();
  const procDay = moment(dateStr, 'DD.MM.YYYY').format('YYYY-MM-DD');

  for (let i = 0; i < municipalities.length; i += 1) {
    const mun = municipalities[i];
    const { entityCode, municipalityCode, id: munId } = mun;

    const qryHelpers = { entityCode, municipalityCode, procDay };

    const activeRegistries = await queries.govData.getByCountStatus('active', qryHelpers);
    const suspiciousRegistries = await queries.govData.getByCountStatus('suspicious', qryHelpers);
    const deathRegistries = await queries.govData.getByCountStatus('death', qryHelpers);
    const recoveryRegistries = await queries.govData.getByCountStatus('recovery', qryHelpers);
    const negativeRegistries = await queries.govData.getByCountStatus('negative', qryHelpers);

    const createParams = {
      dataDate: procDay,
      confirmed: activeRegistries,
      deceased: deathRegistries,
      negative: negativeRegistries,
      recovered: recoveryRegistries,
      suspicious: suspiciousRegistries,
    };

    await queries.mexData.saveDayData({ ...createParams }, munId);
  }
  await queries.days.dayProcessed(procDay);
}

async function loadMunicipalities(muns) {
  for (let i = 0; i < muns.length; i += 1) {
    await queries.municipalities.create({ ...muns[i] });
  }
}

exports.summarizeCases = summarizeCases;
exports.agregateDataDay = agregateDataDay;
exports.getUSPopulation = getUSPopulation;
exports.normalizeUSData = normalizeUSData;
exports.generateUSTimeSeries = generateUSTimeSeries;
exports.processDay = processDay;
exports.saveProcessed = saveProcessed;
exports.loadMunicipalities = loadMunicipalities;
