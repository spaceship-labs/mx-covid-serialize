/*
  entityCode,
  entityName,
  municipalityCode,
  municipalityName,
  avgLat,
  avgLon,
  popCenterLat,
  popCenterLon,
  population
*/

import { DataTypes, Model } from 'sequelize';

class Municipality extends Model { }

function addModel(sequelize) {
  Municipality.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    entityCode: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    entityName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    municipalityCode: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    municipalityName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    avgLat: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    avgLon: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    popCenterLat: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    popCenterLon: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    population: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    sequelize,
  });
}

function associate(models) {
  Municipality.hasMany(models.MexData, { as: 'MexData' });
}

export default { addModel, associate };
