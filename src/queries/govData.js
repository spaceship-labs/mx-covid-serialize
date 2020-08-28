import { Op } from 'sequelize';
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

function getStatusParams(status, day) {
  const conds = [];
  const qryParams = {};
  if (status === 'active' || status === 'active') {
    conds.push({
      status,
      fechaAparicion: { [Op.lte]: day },
      fechaConfirmacion: { [Op.lte]: day },
    });

    conds.push({
      status: 'recovery',
      fechaAparicion: { [Op.lte]: day },
      fechaConfirmacion: { [Op.lte]: day },
      fechaAlta: { [Op.gt]: day },
    });

    conds.push({
      status: 'death',
      fechaAparicion: { [Op.lte]: day },
      fechaConfirmacion: { [Op.lte]: day },
      fechaDefuncion: { [Op.gt]: day },
    });
  } else if (status === 'suspicious') {
    conds.push({
      status,
      fechaAparicion: { [Op.lte]: day },
    });

    conds.push({
      fechaAparicion: { [Op.lte]: day },
      fechaConfirmacion: { [Op.gt]: day },
    });
  } else if (status === 'recovery') {
    conds.push({
      status,
      fechaAparicion: { [Op.lte]: day },
      fechaAlta: { [Op.lte]: day },
    });
  } else if (status === 'death') {
    conds.push({
      status,
      fechaAparicion: { [Op.lte]: day },
      fechaDefuncion: { [Op.lte]: day },
    });
  }
  return [...conds];
}

async function getByCountStatus(status, params) {
  const { procDay, municipalityCode, entityCode } = params;
  const instance = db.sequelize.models.GovData;
  const queryConds = getStatusParams(status, procDay);
  const whereExtras = queryConds.length > 1 ? { [Op.or]: [...queryConds] } : { ...queryConds[0] };
  return instance.count({
    where: {
      [Op.and]: [
        { municipalityCode },
        { entityCode },
        { ...whereExtras },
      ],
    },
  });
}

module.exports = {
  getRegistry,
  updateRegistry,
  createRegistry,
  getByCountStatus,
};
