const { DataTypes } = require("sequelize");
const mySqlSequelize = require("../../config/mysql");

const ProdutosMYSQL = mySqlSequelize.define(
  "ProdutosMYSQL",
  {
    codigoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    pastaPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sistemaPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nomePRODUTO: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    usuarioPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lixeiraPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    datacriacaoPRODUTO: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    observacaoPRODUTO: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    descontinuadoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descontinuarPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    partnumberPRODUTO: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    undprincipalPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pesoliquidoPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    pesobrutoPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    validadePRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    obtencaoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    finalidadePRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    cfPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tributacaoicmsPRODUTO: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    legislacaoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    icmsPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    reducaoPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    fatoricmsPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    ummaisfatoricmsPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    ummenosfatoricmsPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    custosubprocessosPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    custosubprodutosPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    dispararprovidenciaPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qtdemergenciaPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    qtdreposicaoPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    faixacomissaoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    incluirgarantiaPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    diasgarantiaPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    servicoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    operacaocomercialPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    repsimilaresPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precorepPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    sincronizarPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qtdatacadoPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    contacontabilPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipoemergenciaPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visivelwebPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ean13PRODUTO: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    prop1PRODUTO: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    verificaembalagemPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prop2PRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    ppbPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    origempadraoPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dun14PRODUTO: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    prop3PRODUTO: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    especialPRODUTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dataprocessamentoPRODUTO: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    prop4PRODUTO: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    prop5PRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    alturaPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    larguraPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    comprimentoPRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
    volumePRODUTO: {
      type: DataTypes.DECIMAL(18, 9),
      allowNull: false,
    },
  },
  {
    tableName: "tb0501_Produtos",
    timestamps: false,
  }
);

module.exports = ProdutosMYSQL;
