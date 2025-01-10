const { DataTypes } = require("sequelize");
const { sqlServerSequelize } = require("../config/sqlserver");

const ImagensProdutos = sqlServerSequelize.define(
  "ImagensProdutos",
  {
    codigoIMAGEMPRODUTO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    produtosIMAGEMPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nomeIMAGEMPRODUTO: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    pathIMAGEMPRODUTO: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    padraoIMAGEMPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    observacaoIMAGEMPRODUTO: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    cloudIMAGEMPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    padraocloudIMAGEMPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "tb0520_Imagens_Produtos",
    timestamps: false,
  }
);

module.exports = ImagensProdutos;
