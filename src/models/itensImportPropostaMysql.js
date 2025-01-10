const { DataTypes } = require("sequelize");
const { mySqlSequelize } = require("../config");

const ItensImportPropostaMysql = mySqlSequelize.define(
  "ItensImportPropostaMysql",
  {
    codigoITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      defaultValue: 0,
    },
    itemITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    produtoITEMPROPOSTA: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    quantidadeITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuarioITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pedidoITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gerouITEMPROPOSTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "temp0102_itens_propostas",
    timestamps: false,
  }
);

module.exports = ItensImportPropostaMysql;
