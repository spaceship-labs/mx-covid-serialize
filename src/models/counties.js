// fips,county,state
import { DataTypes, Model } from 'sequelize';

class County extends Model { }

function addModel(sequelize) {
  County.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    uid: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    fips: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    provinceState: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    lon: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    lat: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    sequelize,
  });
}

function associate(models) {
  County.hasMany(models.USData, { as: 'USData' });
}

export default { addModel, associate };
