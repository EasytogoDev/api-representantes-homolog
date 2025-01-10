const { DataTypes } = require("sequelize");
const { sqlServerSequelize } = require("../config/sqlserver");

const Temp1603WebPropostas = sqlServerSequelize.define(
  "Temp1603WebPropostas",
  {
    codigoWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    referenciaWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clienteWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vendedorWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transportadoraWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    geroupropostaWEBPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dataWEBPROPOSTA: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    propostaclienteWEBPROPOSTA: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    observacaoWEBPROPOSTA: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
  },
  {
    tableName: "web1603_Web_Propostas",
    timestamps: false, // Não utiliza createdAt e updatedAt
  }
);

module.exports = Temp1603WebPropostas;
