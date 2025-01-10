const { DataTypes } = require("sequelize");
const { mySqlSequelize } = require("../config");

const ItensPropostaMysql = mySqlSequelize.define(
  "ItensPropostaMysql",
  {
    codigoITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      defaultValue: 0,
    },
    propostaITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    produtoITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    partnumberITEMPROPOSTA: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomeITEMPROPOSTA: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantidadeITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    embalagempadraoITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unidadeITEMPROPOSTA: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valorITEMPROPOSTA: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    valorxquantidadeITEMPROPOSTA: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    ipiITEMPROPOSTA: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    valoripiITEMPROPOSTA: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    valorstITEMPROPOSTA: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    valortotalITEMPROPOSTA: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    ativoITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tb0102_itens_propostas",
    timestamps: false,
  }
);

module.exports = ItensPropostaMysql;
