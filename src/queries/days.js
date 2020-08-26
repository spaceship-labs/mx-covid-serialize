import moment from 'moment';
import { db } from '../models';

async function dayProcessed(dateStr) {
  if (!dateStr) return true;

  const today = moment().format('YYYY-MM-DD');

  const res = await db.Days.create({ date: dateStr, firstProcess: today, updateDate: today });
  return !!res;
}

async function getLastProcessed() {
  console.log('Entra a lastDay Proc');
  const day = await db.sequelize.models.Days.findOne({ order: [['id', 'DESC']] });
  console.log(day);
  return day;
}

module.exports = {
  dayProcessed,
  getLastProcessed,
};
