import Sequelize from 'sequelize';
// import fs from 'fs';
// import path from 'path';
import config from '../config';
import Counties from './counties';
import Days from './days';
import GovData from './govData';
import MexData from './mexData';
import Municipalities from './municipalities';
import USData from './usData';

const {
  database,
  username,
  password,
  host,
  dbport,
} = config;

// const basename = path.basename(__filename);

export const db = {};

console.log(config);
const sequelize = new Sequelize(database, username, password, { host, dialect: 'postgres', dbport });

async function main() {
  Counties.addModel(sequelize);
  USData.addModel(sequelize);
  Days.addModel(sequelize);
  GovData.addModel(sequelize);
  Municipalities.addModel(sequelize);
  MexData.addModel(sequelize);

  console.log(sequelize.models);

  Counties.associate(sequelize.models);
  USData.associate(sequelize.models);
  // Days.associate(sequelize.models);
  // GovData.associate(sequelize.models);
  Municipalities.associate(sequelize.models);
  MexData.associate(sequelize.models);

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  // sequelize.drop();
  // await db.sequelize.sync();

  // db.sequelize = sequelize;
  // db.Sequelize = Sequelize;
}

export default main;
