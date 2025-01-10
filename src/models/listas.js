const { DataTypes } = require("sequelize");
const { sqlServerSequelize } = require("../config/sqlserver");

const Listas = sqlServerSequelize.define(
  "Listas",
  {
    codigoLISTA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    sistemaLISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    nomeLISTA: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nomeprocedureLISTA: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    observacaoLISTA: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    ativaLISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    formulaLISTA: {
      type: DataTypes.STRING(4000),
      allowNull: true,
    },
    pastasLISTA: {
      type: DataTypes.STRING(4000),
      allowNull: false,
      defaultValue: "0",
    },
    precisaoLISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    pastaLISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    usuarioLISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    recalculoLISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    ordemLISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lucroLISTA: {
      type: DataTypes.STRING(4000),
      allowNull: true,
    },
    finalidadeLISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    padraoLISTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    entidadeLISTA: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "tb0508_Listas",
    timestamps: false,
  }
);

module.exports = Listas;
