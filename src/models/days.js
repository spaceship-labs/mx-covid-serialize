import { DataTypes, Model } from 'sequelize';

class Days extends Model { }

function addModel(sequelize) {
  Days.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    date: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    firstProcess: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    updateDate: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    sequelize,
  });

  // Days.associate = (models) => {
  //   Days.belongsTo(models.Municipalities, { as: 'Municipality' });
  // };
}

export default { addModel };
