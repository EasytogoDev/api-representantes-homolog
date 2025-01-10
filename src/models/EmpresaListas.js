const { DataTypes } = require("sequelize");
const { sqlServerSequelize } = require("../config/sqlserver");

const EmpresaListas = sqlServerSequelize.define(
  "EmpresaListas",
  {
    empresaEMPRESALISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    listaEMPRESALISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    padraoEMPRESALISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tb0316_Listas",
    timestamps: false,
  }
);

module.exports = EmpresaListas;
