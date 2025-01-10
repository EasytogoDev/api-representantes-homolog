const { DataTypes } = require("sequelize");
const { sqlServerSequelize } = require("../config/sqlserver");

const Temp1604ItensWebProposta = sqlServerSequelize.define(
  "Temp1604ItensWebProposta",
  {
    codigoITEMWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    referenciaITEMWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    referenciapropostaITEMWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    propostaITEMWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    produtoITEMWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantidadeITEMWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ordemITEMWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "web1604_Itens_Web_Proposta", // Nome da tabela no banco de dados
    timestamps: false, // Não usa createdAt e updatedAt
  }
);

module.exports = Temp1604ItensWebProposta;
