const { DataTypes } = require("sequelize");
const mySqlSequelize = require("../../config/mysql");

const ErrosSiscomex = mySqlSequelize.define(
  "ErrosSiscomex",
  {
    codigo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    descricao: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    denominacao: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    codigoInterno: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    erro: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "erros_siscomex", // Nome da tabela
    timestamps: false, // Não usa createdAt e updatedAt
  }
);

module.exports = ErrosSiscomex;
