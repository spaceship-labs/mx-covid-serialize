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
  // try {
  console.log(db.sequelize.models.GovData);
  return db.sequelize.models.GovData.create(regData).catch((res) => {
    console.log('Creaaaa!!');
    console.log(res);
  });
  // } catch (e) {
  // console.log('Error!!!!!!!!!!');
  // console.error(e);
  // }

  // return true;
}

module.exports = {
  getRegistry,
  updateRegistry,
  createRegistry,
};
