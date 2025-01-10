const { DataTypes } = require("sequelize");
const mySqlSequelize = require("../../config/mysql");

const ItensPropostaMYSQL = mySqlSequelize.define(
  "ItensPropostaMYSQL",
  {
    codigoITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nomeITEMPROPOSTA: {
      type: DataTypes.STRING(255),
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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    valorITEMPROPOSTA: {
      type: DataTypes.DOUBLE(10, 6),
      allowNull: false,
    },
    valorxquantidadeITEMPROPOSTA: {
      type: DataTypes.FLOAT(18, 6),
      allowNull: false,
    },
    ipiITEMPROPOSTA: {
      type: DataTypes.DOUBLE(10, 6),
      allowNull: false,
    },
    valoripiITEMPROPOSTA: {
      type: DataTypes.DOUBLE(10, 6),
      allowNull: false,
    },
    valorstITEMPROPOSTA: {
      type: DataTypes.DOUBLE(10, 6),
      allowNull: false,
    },
    valortotalITEMPROPOSTA: {
      type: DataTypes.FLOAT(18, 6),
      allowNull: false,
    },
    ativoITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tb0102_itens_propostas", // Nome da tabela
    timestamps: false, // Não usa createdAt e updatedAt
  }
);

module.exports = ItensPropostaMYSQL;
