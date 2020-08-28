import { db } from '../models';

async function create(mun) {
  return db.sequelize.models.Municipality.create({ ...mun });
}

async function getAll() {
  return db.sequelize.models.Municipality.findAll({ attributes: ['id'] });
}

module.exports = { create, getAll };
