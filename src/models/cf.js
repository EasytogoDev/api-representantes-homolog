const { DataTypes } = require("sequelize");
const { sqlServerSequelize } = require("../config/sqlserver");

const CF = sqlServerSequelize.define(
  "CF",
  {
    codigoCF: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    pastaCF: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 507,
    },
    sistemaCF: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    usuarioCF: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lixeiraCF: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    nomeCF: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    excecaoCF: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    textofiscalCF: {
      type: DataTypes.STRING(4000),
      allowNull: false,
    },
    ipiCF: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    iiCF: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    pisCF: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    cofinsCF: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    padraoCF: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    inativaCF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    letraCF: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    excecaofiscalCF: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    cumulativoCF: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    camexCF: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    aliqnacionalCF: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: true,
      defaultValue: 0,
    },
    aliqimportadaCF: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: true,
      defaultValue: 0,
    },
    acspCF: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    dataprocessamentoCF: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cestCF: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
  },
  {
    tableName: "tb0507_CF",
    timestamps: false,
  }
);

module.exports = CF;
