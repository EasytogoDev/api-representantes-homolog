const { DataTypes } = require("sequelize");
const mySqlSequelize = require("../../config/mysql");

const PropostasMYSQL = mySqlSequelize.define(
  "PropostasMYSQL",
  {
    codigoPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
      type: DataTypes.STRING(255),
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
      type: DataTypes.ENUM("0", "1"),
      allowNull: false,
    },
    lixeiraPROPOSTA: {
      type: DataTypes.ENUM("0", "1"),
      allowNull: false,
    },
    ativoPROPOSTA: {
      type: DataTypes.ENUM("1", "0"),
      allowNull: false,
    },
  },
  {
    tableName: "tb0101_propostas", // Nome da tabela
    timestamps: false, // Não usa createdAt e updatedAt
  }
);

module.exports = PropostasMYSQL;
