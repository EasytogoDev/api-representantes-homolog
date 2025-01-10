const { DataTypes } = require("sequelize");
const { sqlServerSequelize } = require("../config/sqlserver");

const EmpresaCPGTO = sqlServerSequelize.define(
  "EmpresaCPGTO",
  {
    empresaEMPRESACPGTO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cpgtoEMPRESACPGTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    padraoEMPRESACPGTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuarioEMPRESACPGTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tb0308_CPGTO",
    timestamps: false,
  }
);

module.exports = EmpresaCPGTO;
