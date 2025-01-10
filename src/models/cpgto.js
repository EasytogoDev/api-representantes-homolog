const { DataTypes } = require("sequelize");
const { sqlServerSequelize } = require("../config/sqlserver");

const CPGTO = sqlServerSequelize.define(
  "CPGTO",
  {
    codigoCPGTO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    lixeiraCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    pastaCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sistemaCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    nomeCPGTO: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    diasCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    diasmediosCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    tipodiaCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    periodoCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipoperiodoCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tipoCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parcelasCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    intervalosCPGTO: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    diasemanaCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    padraoCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entidadeCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipopagamentoCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    ativoCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    limitedeCPGTO: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    limiteateCPGTO: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    fatorpercentualCPGTO: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    diasstCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tipovencsemanalCPGTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "tb1605_CPGTO",
    timestamps: false,
  }
);

module.exports = CPGTO;
