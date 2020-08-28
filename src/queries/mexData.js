import moment from 'moment';
import { db } from '../models';

async function saveDayData(params, munId) {
  const dayData = await db.sequelize.models.MexData.create({ ...params });
  return dayData.setMunicipality(munId);
}

module.exports = { saveDayData };
