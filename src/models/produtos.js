const { DataTypes } = require("sequelize");
const { sqlServerSequelize } = require("../config/sqlserver");

const Produtos = sqlServerSequelize.define(
  "Produtos",
  {
    codigoPRODUTO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    pastaPRODUTO: { type: DataTypes.INTEGER, allowNull: true },
    sistemaPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    nomePRODUTO: { type: DataTypes.STRING(100), allowNull: true },
    usuarioPRODUTO: { type: DataTypes.INTEGER, allowNull: false },
    lixeiraPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    datacriacaoPRODUTO: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    observacaoPRODUTO: { type: DataTypes.STRING(1000), allowNull: true },
    descontinuadoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    descontinuarPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    partnumberPRODUTO: { type: DataTypes.STRING(50), allowNull: true },
    undprincipalPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 9,
    },
    pesoliquidoPRODUTO: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: true,
      defaultValue: 0,
    },
    pesobrutoPRODUTO: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: true,
      defaultValue: 0,
    },
    validadePRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    obtencaoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    finalidadePRODUTO: { type: DataTypes.DECIMAL(18, 0), allowNull: true },
    cfPRODUTO: { type: DataTypes.INTEGER, allowNull: true },
    tributacaoicmsPRODUTO: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: "0",
    },
    legislacaoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    icmsPRODUTO: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
      defaultValue: 0,
    },
    reducaoPRODUTO: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    fatoricmsPRODUTO: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      defaultValue: 0,
    },
    ummaisfatoricmsPRODUTO: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      defaultValue: 0,
    },
    ummenosfatoricmsPRODUTO: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      defaultValue: 0,
    },
    custosubprocessosPRODUTO: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      defaultValue: 0,
    },
    custosubprodutosPRODUTO: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      defaultValue: 0,
    },
    dispararprovidenciaPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    qtdemergenciaPRODUTO: { type: DataTypes.DECIMAL(18, 0), allowNull: true },
    qtdreposicaoPRODUTO: { type: DataTypes.DECIMAL(18, 0), allowNull: true },
    faixacomissaoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    incluirgarantiaPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    diasgarantiaPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tipoPRODUTO: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    servicoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    operacaocomercialPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    repsimilaresPRODUTO: { type: DataTypes.INTEGER, allowNull: true },
    precorepPRODUTO: { type: DataTypes.DECIMAL(18, 6), allowNull: true },
    sincronizarPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    qtdatacadoPRODUTO: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: false,
      defaultValue: 0,
    },
    contacontabilPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tipoemergenciaPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    visivelwebPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    ean13PRODUTO: { type: DataTypes.STRING(70), allowNull: true },
    prop1PRODUTO: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "0",
    },
    verificaembalagemPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    prop2PRODUTO: {
      type: DataTypes.DECIMAL(18, 1),
      allowNull: true,
      defaultValue: 60,
    },
    ppbPRODUTO: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    origempadraoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    dun14PRODUTO: { type: DataTypes.STRING(70), allowNull: true },
    prop3PRODUTO: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: "Real",
    },
    especialPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    dataprocessamentoPRODUTO: { type: DataTypes.DATE, allowNull: true },
    prop4PRODUTO: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Nenhum",
    },
    prop5PRODUTO: { type: DataTypes.DECIMAL(18, 0), allowNull: true },
    prop6PRODUTO: { type: DataTypes.DECIMAL(18, 0), allowNull: true },
    prop7PRODUTO: { type: DataTypes.DECIMAL(18, 6), allowNull: true },
    operacaocomercialcompraPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    prop8PRODUTO: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: "0",
    },
    prop9PRODUTO: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
      defaultValue: 0,
    },
    prop10PRODUTO: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
      defaultValue: 0,
    },
    prop11PRODUTO: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: "0",
    },
    prop15PRODUTO: {
      type: DataTypes.DECIMAL(18, 5),
      allowNull: true,
      defaultValue: 0,
    },
    prop17PRODUTO: {
      type: DataTypes.STRING(14),
      allowNull: true,
      defaultValue: "0",
    },
    valorirPRODUTO: {
      type: DataTypes.DECIMAL(13, 2),
      allowNull: true,
      defaultValue: 0,
    },
    undtributavelPRODUTO: { type: DataTypes.INTEGER, allowNull: true },
    prop19PRODUTO: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "0",
    },
    prop20PRODUTO: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
      defaultValue: 0,
    },
    prop23PRODUTO: {
      type: DataTypes.STRING(4),
      allowNull: true,
      defaultValue: "0",
    },
    prop25PRODUTO: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "0",
    },
    prop29PRODUTO: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "0",
    },
    prop31PRODUTO: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "0",
    },
    prop32PRODUTO: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "0",
    },
    prop45PRODUTO: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "0",
    },
    prop46PRODUTO: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "0",
    },
  },
  {
    tableName: "tb0501_Produtos",
    timestamps: false,
  }
);

module.exports = Produtos;
