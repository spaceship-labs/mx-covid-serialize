import Fs from 'fs';
import ProgressBar from 'progress';
import Axios from 'axios';
import DecompressZip from 'decompress-zip';
import moment from 'moment';

const downloadCSV = async (url, filename) => {
  console.log('Connecting …');
  const { data, headers } = await Axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  const totalLength = headers['content-length'];
  console.log('Starting download');
  const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
    width: 40,
    complete: '=',
    incomplete: ' ',
    renderThrottle: 1,
    total: parseInt(totalLength, 10),
  });
  const writer = Fs.createWriteStream(`./data/source/csv/${filename}`);
  data.on('data', (chunk) => progressBar.tick(chunk.length));
  data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const downloadZip = async (url) => {
  console.log('Connecting …');
  const { data, headers } = await Axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  const totalLength = headers['content-length'];
  console.log('Starting download');
  const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
    width: 40,
    complete: '=',
    incomplete: ' ',
    renderThrottle: 1,
    total: parseInt(totalLength, 10),
  });
  const writer = Fs.createWriteStream('./temp/pkg.zip');
  data.on('data', (chunk) => progressBar.tick(chunk.length));
  data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// Deflates temp/pkg.zip
const deflate = async () => {
  console.log('deflating');
  return new Promise((resolve, reject) => {
    const unzipper = new DecompressZip('./temp/pkg.zip');
    unzipper.on('extract', resolve);
    unzipper.on('error', reject);
    unzipper.extract({ path: './data/source/csv', restrict: false });
  });
};

// Downloads and Unzips the open data file for specified date
// if none is specified then latest file is downloaded.
// Returns filename for unzipped file
// Date should be in this format: 12.04.2020

const download = async (date) => {
  const base = 'http://datosabiertos.salud.gob.mx/gobmx/salud/datos_abiertos/';
  // const base = 'http://187.191.75.115/gobmx/salud/datos_abiertos/';
  const file = date ? `historicos/${date[3]}${date[4]}/datos_abiertos_covid19_${date}.zip` : 'datos_abiertos_covid19.zip';
  try {
    console.log(`${base}${file}`);
    await downloadZip(`${base}${file}`);
    const [{ deflated }] = await deflate();
    // console.log(deflated);
    return deflated;
  } catch (e) {
    console.log(`Error downloading file for date: ${date}`);
    console.log(e);
    return false;
  }
};

const downloadAll = async () => {
  let file;
  // THe first day that the Mexican Government started releasing data
  const files = [];
  const start = moment('2020-04-13', 'YYYY-MM-DD');
  const today = moment();
  const daysDiff = today.diff(start, 'days');
  for (let i = 0; i < daysDiff; i += 1) {
    const dateString = start.format('DD.MM.YYYY');
    console.log(dateString);
    file = await download(dateString);
    if (file) files.push(file);
    start.add(1, 'days');
  }
  console.log('Sale');
  file = await download();
  if (file) files.push(file);
  return files;
};

export default {
  download,
  downloadAll,
  downloadCSV,
};
