const { sqlServerSequelize } = require("../config/sqlserver");
const Usuarios = require("./usuarios");
const Vendedores = require("./vendedores");
const PedidosCompra = require("./pedidos");
const Propostas = require("./propostas");
const Temp1601RetornoWms = require("./temp_wms");
const Temp1602RetornoItensWms = require("./temp_itens_wms");
const Empresa = require("./empresas");
const Telefone = require("./telefones");
const TipoTelefone = require("./tipos_telefones");
const Email = require("./emails");
const TipoEmail = require("./tipo_emails");
const Endereco = require("./enderecos");
const Cidade = require("./cidades");
const Carteira = require("./carteiras");
const ItemNFe = require("./itemnfe");
const GerenciadorNFe = require("./gerenciadornfe");
const CabecalhoNFe = require("./cabecalhonfe");
const Produtos = require("./produtos");
const ItensProposta = require("./itenspropostas");
const PropostasMYSQL = require("./mysql/propostas");
const ProdutosMYSQL = require("./mysql/produtos");
const ItensPropostaMYSQL = require("./mysql/itensPropostas");
const ErrosSiscomex = require("./mysql/erros_siscomex");
const CF = require("./cf");
const ImagensProdutos = require("./imagens_produtos");
const ItensPropostaMysql = require("./itensPropostaMysql");
const PropostaMysql = require("./propostaMysql");
const CPGTO = require("./cpgto");
const Listas = require("./listas");
const EmpresaCPGTO = require("./EmpresaCPGTO");
const EmpresaListas = require("./EmpresaListas");
const Temp1603WebPropostas = require("./temp_propostas_web");
const Temp1604ItensWebProposta = require("./temp_itens_web");
const ItensImportPropostaMysql = require("./itensImportPropostaMysql");

Empresa.hasMany(Endereco, {
  foreignKey: "empresaENDERECO",
  as: "enderecos",
});

Endereco.belongsTo(Empresa, {
  foreignKey: "empresaENDERECO",
  as: "empresa",
});

Empresa.hasMany(Email, {
  foreignKey: "empresaEMAIL",
  as: "emails",
});
Email.belongsTo(Empresa, {
  foreignKey: "empresaEMAIL",
  as: "empresa",
});

Empresa.hasMany(Carteira, {
  foreignKey: "empresaCARTEIRA",
  as: "carteiras",
});
Carteira.belongsTo(Empresa, {
  foreignKey: "empresaCARTEIRA",
  as: "empresa",
});

Endereco.belongsTo(Cidade, {
  foreignKey: "cidadeENDERECO", // Chave estrangeira em Endereco que se refere à Cidade
  as: "cidade",
});

// Correto: Uma Cidade tem muitos Enderecos
Cidade.hasMany(Endereco, {
  foreignKey: "cidadeENDERECO", // Chave estrangeira em Endereco
  as: "enderecos",
});

Empresa.hasMany(Telefone, {
  foreignKey: "empresaTELEFONE",
  as: "telefone",
});

Telefone.belongsTo(Empresa, {
  foreignKey: "empresaTELEFONE",
  as: "empresa",
});

TipoTelefone.hasMany(Telefone, {
  foreignKey: "tipoTELEFONE",
  as: "telefone",
});

Telefone.belongsTo(TipoTelefone, {
  foreignKey: "tipoTELEFONE",
  as: "tipo_telefone",
});

TipoEmail.hasMany(Email, {
  foreignKey: "tipoEMAIL",
  as: "email",
});

Email.belongsTo(TipoEmail, {
  foreignKey: "tipoEMAIL",
  as: "tipo_email",
});

Propostas.belongsTo(Empresa, {
  foreignKey: "clientePROPOSTA",
  as: "empresa",
});

Empresa.hasMany(Propostas, {
  foreignKey: "clientePROPOSTA",
  as: "propostas",
});
// PedidosCompra.js
PedidosCompra.hasMany(CabecalhoNFe, {
  foreignKey: "gerenciadorCABNFE",
  as: "CabecalhoNFe",
});

CabecalhoNFe.belongsTo(PedidosCompra, {
  foreignKey: "gerenciadorCABNFE",
  as: "Pedidos",
});

// CabecalhoNFe.js
CabecalhoNFe.belongsTo(GerenciadorNFe, {
  foreignKey: "gerenciadorCABNFE",
  as: "GerenciadorNFe",
});

GerenciadorNFe.hasMany(CabecalhoNFe, {
  foreignKey: "gerenciadorCABNFE",
  as: "CabecalhoNFe",
});

// ItemNFe.js
CabecalhoNFe.hasMany(ItemNFe, {
  foreignKey: "cabecalhoITEMNFE",
  as: "ItemNfes",
});

ItemNFe.belongsTo(CabecalhoNFe, {
  foreignKey: "cabecalhoITEMNFE",
  as: "CabecalhoNFe",
});

Produtos.belongsTo(CF, {
  foreignKey: "cfPRODUTO", // Chave estrangeira em Produtos
  // targetKey: "codigoCF",   // Chave primária em CF
  as: "cf", // Alias para acessar o CF associado
});

// CF pode estar associado a muitos Produtos
CF.hasMany(Produtos, {
  foreignKey: "cfPRODUTO", // Chave estrangeira em Produtos
  // sourceKey: "codigoCF",   // Chave primária em CF
  as: "produtos", // Alias para acessar os Produtos associados
});

Produtos.hasMany(ImagensProdutos, {
  foreignKey: "produtosIMAGEMPRODUTO", // Chave estrangeira em ImagensProdutos
  // sourceKey: "codigoPRODUTO",         // Chave primária em Produtos
  as: "imagens", // Alias para acessar as imagens associadas
});

// ImagensProdutos pertence a um único produto
ImagensProdutos.belongsTo(Produtos, {
  foreignKey: "produtosIMAGEMPRODUTO", // Chave estrangeira em ImagensProdutos
  // targetKey: "codigoPRODUTO",          // Chave primária em Produtos
  as: "produto", // Alias para acessar o produto associado
});
// Associação de PropostasMYSQL com ItensPropostaMYSQL
PropostasMYSQL.hasMany(ItensPropostaMYSQL, {
  foreignKey: "propostaITEMPROPOSTA", // Chave estrangeira em ItensPropostaMYSQL
  as: "itens", // Alias utilizado no include
});

ItensPropostaMYSQL.belongsTo(PropostasMYSQL, {
  foreignKey: "propostaITEMPROPOSTA", // Chave estrangeira em ItensPropostaMYSQL
  as: "proposta", // Alias opcional
});

module.exports = {
  sqlServerSequelize,
  Usuarios,
  Vendedores,
  PedidosCompra,
  Propostas,
  Temp1601RetornoWms,
  Temp1602RetornoItensWms,
  Empresa,
  Telefone,
  TipoTelefone,
  Email,
  TipoEmail,
  Endereco,
  Cidade,
  Carteira,
  ItemNFe,
  GerenciadorNFe,
  CabecalhoNFe,
  Produtos,
  ItensProposta,
  PropostasMYSQL,
  ItensPropostaMYSQL,
  ImagensProdutos,
  CF,
  ProdutosMYSQL,
  ErrosSiscomex,
  ItensPropostaMysql,
  PropostaMysql,
  Listas,
  CPGTO,
  EmpresaListas,
  EmpresaCPGTO,
  Temp1603WebPropostas,
  Temp1604ItensWebProposta,
  ItensImportPropostaMysql,
};
