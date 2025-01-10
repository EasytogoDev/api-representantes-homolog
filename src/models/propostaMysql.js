const { DataTypes } = require("sequelize");
const { mySqlSequelize } = require("../config");

const PropostaMysql = mySqlSequelize.define(
  "PropostaMysql",
  {
    codigoPROPOSTA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    pedidoPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuarioPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vendedorPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clientePROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nomePROPOSTA: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dataPROPOSTA: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    observacaoPROPOSTA: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    transportadoraPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    envioPROPOSTA: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    lixeiraPROPOSTA: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    quantidadePROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    valortotalPROPOSTA: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
      defaultValue: 0.0,
    },
    valoripiPROPOSTA: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
      defaultValue: 0.0,
    },
    ativoPROPOSTA: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  {
    tableName: "tb0101_propostas",
    timestamps: false,
  }
);

module.exports = PropostaMysql;
