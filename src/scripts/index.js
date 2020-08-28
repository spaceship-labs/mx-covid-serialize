import Moment from 'moment';
import csvConverter from 'json-2-csv';
import downloadHelper from '../helpers/downloadHelper';
import fileHelper from '../helpers/fileHelper';
import dataHelper from '../helpers/dataHelper';
import initDb, { db } from '../models';
import queries from '../queries';

async function getDateArray(start) {
  const arr = [];
  const dt = Moment(start);
  const end = await fileHelper.getEndDate();
  while (dt.isBefore(end, 'day')) {
    arr.push(Moment(dt));
    dt.add(1, 'days');
  }
  return arr;
}

// Downloads all source data and creates the JSON summary file
// async function initialize() {
//   const files = await downloadHelper.downloadAll();
//   console.log(files);
//   let timeSeries = await fileHelper.loadJSON('./data/municipios.json');
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     const date = [file.slice(4, 6), file.slice(2, 4), file.slice(0, 2)].join('-');
//     const entries = await fileHelper.parseCSV(file);
//     const summary = dataHelper.summarizeCases(entries, date);
//     timeSeries = dataHelper.agregateDataDay(timeSeries, summary, date);
//   }
//   await fileHelper.saveJSON('./data/output/timeSeries.json', timeSeries);
// }

async function initData() {
  const lastDay = await queries.days.getLastProcessed();
  const municipalities = await fileHelper.loadJSON('data/source/municipios.json');

  await dataHelper.loadMunicipalities(municipalities);

  const startDateStr = lastDay
    ? Moment(lastDay.date, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')
    : '2020-04-12';
  const dateItr = Moment(startDateStr, 'YYYY-MM-DD');
  const today = Moment();
  let err = false;
  let count = 0;
  while (!err && today.isAfter(dateItr) && count < 5) {
    let tries = 0;
    let done = false;
    const dateString = today.isSame(dateItr) ? null : dateItr.format('DD.MM.YYYY');
    console.log(dateString);
    let file = null;
    let result = false;

    while (!done && tries < 3) {
      file = await downloadHelper.download(dateString);
      if (file) {
        done = true;
      } else {
        tries += 1;
      }
    }

    if (done) result = await dataHelper.processDay(file);
    if (result && dateString) await dataHelper.saveProcessed(dateString);
    if (!done || !result) err = true;

    dateItr.add(1, 'days');
    count += 1;
  }

  if (!err) {
    console.log('Data initialized successfully');
  } else {
    console.log('Data could not be initialized.');
    const lastProcessed = dateItr.subtract(2, 'days').format('YYYY-MM-DD');
    console.log(`Last processed day: ${lastProcessed}`);
    console.error('Error during initialize se above for more details.');
  }
}

// Downloads and processes only the latest date returns
async function update() {
  const file = await downloadHelper.download();
  if (!file) return;
  let timeSeries = await fileHelper.loadJSON('./data/output/timeSeries.json');
  const date = [file.slice(4, 6), file.slice(2, 4), file.slice(0, 2)].join('-');
  const entries = await fileHelper.parseCSV(file);
  const summary = dataHelper.summarizeCases(entries);
  timeSeries = dataHelper.agregateDataDay(timeSeries, summary, date);
  await fileHelper.saveJSON('./data/output/timeSeries.json', timeSeries);
}

async function makeCSV(dimension) {
  const timeSeries = await fileHelper.loadJSON('./data/output/timeSeries.json');
  const startDate = Moment('2020-04-13', 'YYYY-MM-DD');
  const dateArr = await getDateArray(startDate);
  const extract = timeSeries.map((m) => {
    const entry = { ...m };
    delete entry.entries;
    dateArr.forEach((date) => {
      const dateString = Moment(date).format('DD-MM-YY');
      entry[dateString] = typeof (m.entries[dateString]) === 'undefined' ? 0 : m.entries[dateString][dimension];
    });
    return entry;
  });

  const csv = await csvConverter.json2csvAsync(extract);
  return fileHelper.saveCSV(`./data/output/csv/${dimension}-time-series.csv`, csv);
}

async function callGenerate(dim) {
  const availableDimensions = [
    'suspicious',
    'confirmed',
    'deaths',
    'recoveries',
    'negative',
    'active',
  ];

  if (!availableDimensions.includes(dim)) throw new Error('Invalid data dimension for CSV generate');

  makeCSV(dim);
}

async function getUSData() {
  const usDatasets = [{
    url: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv',
    filename: 'us_confirmed.csv',
    dimension: 'confirmed',
  },
  {
    url: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv',
    filename: 'us_deaths.csv',
    dimension: 'deaths',
  },
  {
    url: 'https://usafactsstatic.blob.core.windows.net/public/data/covid-19/covid_county_population_usafacts.csv',
    filename: 'us_population.csv',
    dimension: 'population',
  },
  ];

  const usData = {};

  // for (const dataSet of usDatasets) {
  //   console.log(dataSet);
  //   const { url, filename, dimension } = dataSet;
  //   await downloadHelper.downloadCSV(url, filename);

  //   const parsedFile = await fileHelper.parseCSV(filename);
  //   const data = dimension === 'population'
  // ? dataHelper.getUSPopulation(parsedFile)
  // : dataHelper.normalizeUSData(parsedFile);
  //   usData[dimension] = data;
  // }

  await Promise.all(usDatasets.map(async (dataSet) => {
    console.log(dataSet);
    const { url, filename, dimension } = dataSet;
    await downloadHelper.downloadCSV(url, filename);

    const parsedFile = await fileHelper.parseCSV(filename);
    const data = dimension === 'population' ? dataHelper.getUSPopulation(parsedFile) : dataHelper.normalizeUSData(parsedFile);
    usData[dimension] = data;
  }));

  await dataHelper.generateUSTimeSeries(usData);
  const USTimeSeries = await dataHelper.generateUSTimeSeries(usData);

  await fileHelper.saveJSON('./data/output/timeSeriesUS.json', USTimeSeries);
}

async function main(prcs) {
  await initDb();
  await db.sequelize.sync();

  switch (prcs) {
    case 'initialize':
      // await initialize();
      await initData();
      break;
    case 'update':
      update();
      break;
    case 'generate':
      callGenerate(process.argv[3]);
      break;
    default:
      throw new Error('Invalid action arg');
  }
  if (prcs === 'initialize' || prcs === 'update') await getUSData();
}

if (process.argv.length < 3) {
  throw new Error('Expected at least one argument');
}

main(process.argv[2]);
