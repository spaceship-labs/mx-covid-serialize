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
    fips: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    state: {
      allowNull: true,
      type: DataTypes.STRING,
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
