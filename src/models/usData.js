// UID,iso2,iso3,code3,FIPS,Admin2,Province_State,Country_Region,Lat,Long_,Combined_Key
import { DataTypes, Model } from 'sequelize';

class USData extends Model { }

function addModel(sequelize) {
  USData.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    fips: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    date: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    type: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    amount: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: true,
    tableName: 'eeuu_data',
    underscored: true,
    paranoid: true,
    sequelize,
  });
}

function associate(models) {
  USData.belongsTo(models.County, { as: 'County' });
}

export default { addModel, associate };
