import { DataTypes, Model } from 'sequelize';

class MexData extends Model { }

function addModel(sequelize) {
  MexData.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    dataDate: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    confirmed: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    deceased: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    negative: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    suspicious: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    recovered: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: true,
    tableName: 'mexico_data',
    underscored: true,
    paranoid: true,
    sequelize,
  });
}

function associate(models) {
  MexData.belongsTo(models.Municipality, { as: 'Municipality' });
}

export default { addModel, associate };
