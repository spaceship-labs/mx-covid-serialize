import { DataTypes, Model } from 'sequelize';

class GovData extends Model { }

function addModel(sequelize) {
  GovData.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    idRegistro: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    fechaActualizacion: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    origen: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    sector: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    entidadUM: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    sexo: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    entidadNac: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    entidadRes: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    municipioRes: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    tipoPaciente: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    fechaIngreso: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    fechaSintomas: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    fechaDefuncion: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    intubado: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    neumonia: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    edad: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    nacionalidad: {
      allowNull: false,
      type: DataTypes.SRING,
    },
    embarazo: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    lenguaIndigena: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    diabetes: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    epoc: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    asma: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    inmusupr: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    hipertension: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    otraComp: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    cardiovascular: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    obesidad: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    renalCronica: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    tabaquismo: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    otroCaso: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    resultado: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    migrante: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    paisNacionalidad: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    paisOrigen: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    uci: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    fechaAparicion: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    fechaConfirmacion: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    fechaAlta: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
    tableName: 'government_data',
    underscored: true,
    paranoid: true,
    sequelize,
  });

  // GovData.associate = (models) => {
  //   GovData.hasMany(models.Days, { as: 'Days' });
  // };
}

export default { addModel };

/*
GovData.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    idRegistro: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    fechaActualizacion: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    origen: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    sector: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    entidadUM: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    sexo: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    entidadNac: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    entidadRes: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    municipioRes: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    tipoPaciente: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    fechaIngreso: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    fechaSintomas: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    fechaDefuncion: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    intubado: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    neumonia: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    edad: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    nacionalidad: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    embarazo: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    lenguaIndigena: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    diabetes: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    epoc: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    asma: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    inmusupr: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    hipertension: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    otraComp: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    cardiovascular: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    obesidad: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    renalCronica: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    tabaquismo: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    otroCaso: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    resultado: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    migrante: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    paisNacionalidad: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    paisOrigen: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    uci: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    fechaAparicion: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    fechaConfirmacion: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    fechaAlta: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
    tableName: 'government_data',
    underscored: true,
    paranoid: true,
    sequelize,
  });
*/
