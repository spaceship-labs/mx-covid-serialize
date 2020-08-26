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
    uid: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    iso2: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    iso3: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    code3: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    fips: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    admin2: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    province: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    state: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    county_region: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    lat: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    long: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    combined_key: {
      allowNull: true,
      type: DataTypes.INTEGER,
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
