import { db } from '../models';

async function getRegistry(reg) {
  return db.sequelize.models.GovData.findOne({
    where: { idRegistro: reg.idRegistro },
  });
}

async function updateRegistry(params, id) {
  return db.sequelize.models.GovData.update(params, { where: { id } });
}

async function createRegistry(regData) {
  return db.sequelize.models.GovData.create(regData);
}

module.exports = {
  getRegistry,
  updateRegistry,
  createRegistry,
};
