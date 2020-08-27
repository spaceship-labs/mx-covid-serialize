import { db } from '../models';

async function create(mun) {
  return db.sequelize.models.Municipality.create({ ...mun });
}

module.exports = { create };
