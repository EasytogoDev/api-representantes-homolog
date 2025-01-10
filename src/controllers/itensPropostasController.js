const { ItensProposta } = require("../models");
const { sqlServerKnex } = require("../config/sqlserver");
const { BuscarUmPorCodigoProduto } = require("./produtosController");
const { userIsSeller } = require("./empresasController");

 
/* 
exports.criarItemProposta = async (req, res) => {
  const { codigoProduto, proposta, cliente } = req.body;

  const codigoVendedor = await userIsSeller(req);

  try {
    const query = `
      DECLARE @PRODUTO  AS NVARCHAR(255)
      DECLARE @VENDEDOR AS INT 
      DECLARE @EMPRESA AS INT

      SET @PRODUTO = ?
      SET @VENDEDOR = ? 
      SET @EMPRESA = ?

      SELECT 
      
      codigoPRODUTO, 
      partnumberPRODUTO, 
      nomePRODUTO,
      quantidadeEMBALAGEMPRODUTO,
      nomeUNIDADEMEDIDA,precoPRODUTOLISTA, ipiCF, padraoEMBALAGEMPRODUTO

      FROM (

      ----ELETRICA E ACESSÒRIOS
      SELECT  
      codigoPRODUTO, 
      partnumberPRODUTO, 
      nomePRODUTO,
      quantidadeEMBALAGEMPRODUTO,
      nomeUNIDADEMEDIDA,
      descontinuadoPRODUTO,precoPRODUTOLISTA, ipiCF, padraoEMBALAGEMPRODUTO
      FROM tb0501_Produtos
      INNER JOIN tb0001_Pastas ON pastaPRODUTO = codigoPASTA
      INNER JOIN dbo.FnPastaVinculadas(4308, 1) ON codigoPASTA = PASTA  AND entidadePASTA = 501
      INNER JOIN tb0504_Embalagens_Produtos ON produtoEMBALAGEMPRODUTO = codigoPRODUTO
      INNER JOIN tb0505_Unidades_Medidas ON undprincipalPRODUTO = codigoUNIDADEMEDIDA

      INNER JOIN tb0206_Pastas ON codigoPASTA = pastaUSUARIOPASTA -- permissoes
      INNER JOIN tb0201_Usuarios ON usuarioUSUARIOPASTA = codigoUSUARIO
      INNER JOIN tb1609_Vendedores ON codigoUSUARIO = usuarioassociadoVENDEDOR

      INNER JOIN tb0507_CF ON cfPRODUTO = codigoCF
      INNER JOIN tb0509_Produtos_Lista ON codigoPRODUTO = produtoPRODUTOLISTA
      INNER JOIN tb0316_Listas ON listaEMPRESALISTA = listaPRODUTOLISTA

      WHERE 
      visivelwebPRODUTO = '1' 
      AND descontinuadoPRODUTO='0' 
      AND padraoEMBALAGEMPRODUTO = '1' 
      AND valorUSUARIOPASTA = 1
      AND padraoEMPRESALISTA='1'

      --AQUI TRAS O CODIGO BUSCADO E O VENDEDOR
      AND (partnumberPRODUTO LIKE  ''+@PRODUTO+'%') 
      AND codigoVENDEDOR = @VENDEDOR
      AND empresaEMPRESALISTA = @EMPRESA

      UNION

      ----ILUIMINACAO E IMPACTO 
      SELECT    
      codigoPRODUTO, 
      partnumberPRODUTO, 
      nomePRODUTO,
      quantidadeEMBALAGEMPRODUTO,
      nomeUNIDADEMEDIDA,
      descontinuadoPRODUTO,precoPRODUTOLISTA, ipiCF, padraoEMBALAGEMPRODUTO
      FROM tb0501_Produtos
      INNER JOIN tb0001_Pastas ON pastaPRODUTO = codigoPASTA
      INNER JOIN dbo.FnPastaVinculadas(4383, 1) ON codigoPASTA = PASTA  AND entidadePASTA = 501
      INNER JOIN tb0504_Embalagens_Produtos ON produtoEMBALAGEMPRODUTO = codigoPRODUTO
      INNER JOIN tb0505_Unidades_Medidas ON undprincipalPRODUTO = codigoUNIDADEMEDIDA

      INNER JOIN tb0206_Pastas ON codigoPASTA = pastaUSUARIOPASTA -- permissoes
      INNER JOIN tb0201_Usuarios ON usuarioUSUARIOPASTA = codigoUSUARIO
      INNER JOIN tb1609_Vendedores ON codigoUSUARIO = usuarioassociadoVENDEDOR

      INNER JOIN tb0507_CF ON cfPRODUTO = codigoCF
      INNER JOIN tb0509_Produtos_Lista ON codigoPRODUTO = produtoPRODUTOLISTA
      INNER JOIN tb0316_Listas ON listaEMPRESALISTA = listaPRODUTOLISTA

      WHERE 
      visivelwebPRODUTO = '1' 
      AND descontinuadoPRODUTO='0' 
      AND padraoEMBALAGEMPRODUTO = '1' 
      AND valorUSUARIOPASTA = 1
      AND padraoEMPRESALISTA='1'

      --AQUI TRAS O CODIGO BUSCADO E O VENDEDOR
      AND (partnumberPRODUTO LIKE  ''+@PRODUTO+'%') 
      AND codigoVENDEDOR = @VENDEDOR
      AND empresaEMPRESALISTA = @EMPRESA

      UNION

      ----injeção eletronica 
      SELECT    
      codigoPRODUTO, 
      partnumberPRODUTO, 
      nomePRODUTO,
      quantidadeEMBALAGEMPRODUTO,
      nomeUNIDADEMEDIDA,
      descontinuadoPRODUTO ,precoPRODUTOLISTA, ipiCF, padraoEMBALAGEMPRODUTO
      FROM tb0501_Produtos
      INNER JOIN tb0001_Pastas ON pastaPRODUTO = codigoPASTA
      INNER JOIN dbo.FnPastaVinculadas(4384, 1) ON codigoPASTA = PASTA  AND entidadePASTA = 501
      INNER JOIN tb0504_Embalagens_Produtos ON produtoEMBALAGEMPRODUTO = codigoPRODUTO
      INNER JOIN tb0505_Unidades_Medidas ON undprincipalPRODUTO = codigoUNIDADEMEDIDA

      INNER JOIN tb0206_Pastas ON codigoPASTA = pastaUSUARIOPASTA -- permissoes
      INNER JOIN tb0201_Usuarios ON usuarioUSUARIOPASTA = codigoUSUARIO
      INNER JOIN tb1609_Vendedores ON codigoUSUARIO = usuarioassociadoVENDEDOR

      INNER JOIN tb0507_CF ON cfPRODUTO = codigoCF
      INNER JOIN tb0509_Produtos_Lista ON codigoPRODUTO = produtoPRODUTOLISTA
      INNER JOIN tb0316_Listas ON listaEMPRESALISTA = listaPRODUTOLISTA

      WHERE 
      visivelwebPRODUTO = '1' 
      AND descontinuadoPRODUTO='0' 
      AND padraoEMBALAGEMPRODUTO = '1' 
      AND valorUSUARIOPASTA = 1
      AND padraoEMPRESALISTA='1'

      --AQUI TRAS O CODIGO BUSCADO E O VENDEDOR
      AND (partnumberPRODUTO LIKE  ''+@PRODUTO+'%') 
      AND codigoVENDEDOR = @VENDEDOR
      AND empresaEMPRESALISTA = @EMPRESA


      UNION 
      ----partida e alternador
      SELECT    
      codigoPRODUTO, 
      partnumberPRODUTO, 
      nomePRODUTO,
      quantidadeEMBALAGEMPRODUTO,
      nomeUNIDADEMEDIDA,
      descontinuadoPRODUTO ,precoPRODUTOLISTA, ipiCF, padraoEMBALAGEMPRODUTO
      FROM tb0501_Produtos
      INNER JOIN tb0001_Pastas ON pastaPRODUTO = codigoPASTA
      INNER JOIN dbo.FnPastaVinculadas(4385, 1) ON codigoPASTA = PASTA  AND entidadePASTA = 501
      INNER JOIN tb0504_Embalagens_Produtos ON produtoEMBALAGEMPRODUTO = codigoPRODUTO
      INNER JOIN tb0505_Unidades_Medidas ON undprincipalPRODUTO = codigoUNIDADEMEDIDA

      INNER JOIN tb0206_Pastas ON codigoPASTA = pastaUSUARIOPASTA -- permissoes
      INNER JOIN tb0201_Usuarios ON usuarioUSUARIOPASTA = codigoUSUARIO
      INNER JOIN tb1609_Vendedores ON codigoUSUARIO = usuarioassociadoVENDEDOR

      INNER JOIN tb0507_CF ON cfPRODUTO = codigoCF
      INNER JOIN tb0509_Produtos_Lista ON codigoPRODUTO = produtoPRODUTOLISTA
      INNER JOIN tb0316_Listas ON listaEMPRESALISTA = listaPRODUTOLISTA

      WHERE 
      visivelwebPRODUTO = '1' 
      AND descontinuadoPRODUTO='0' 
      AND padraoEMBALAGEMPRODUTO = '1' 
      AND valorUSUARIOPASTA = 1
      AND padraoEMPRESALISTA='1'

      --AQUI TRAS O CODIGO BUSCADO E O VENDEDOR
      AND (partnumberPRODUTO LIKE  ''+@PRODUTO+'%') 
      AND codigoVENDEDOR = @VENDEDOR
      AND empresaEMPRESALISTA = @EMPRESA


      UNION


      ----Material Eletrico
      SELECT    
      codigoPRODUTO, 
      partnumberPRODUTO, 
      nomePRODUTO,
      quantidadeEMBALAGEMPRODUTO,
      nomeUNIDADEMEDIDA,
      descontinuadoPRODUTO ,precoPRODUTOLISTA, ipiCF, padraoEMBALAGEMPRODUTO
      FROM tb0501_Produtos
      INNER JOIN tb0001_Pastas ON pastaPRODUTO = codigoPASTA
      INNER JOIN dbo.FnPastaVinculadas(1696, 1) ON codigoPASTA = PASTA  AND entidadePASTA = 501
      INNER JOIN tb0504_Embalagens_Produtos ON produtoEMBALAGEMPRODUTO = codigoPRODUTO
      INNER JOIN tb0505_Unidades_Medidas ON undprincipalPRODUTO = codigoUNIDADEMEDIDA

      INNER JOIN tb0206_Pastas ON codigoPASTA = pastaUSUARIOPASTA -- permissoes
      INNER JOIN tb0201_Usuarios ON usuarioUSUARIOPASTA = codigoUSUARIO
      INNER JOIN tb1609_Vendedores ON codigoUSUARIO = usuarioassociadoVENDEDOR

      INNER JOIN tb0507_CF ON cfPRODUTO = codigoCF
      INNER JOIN tb0509_Produtos_Lista ON codigoPRODUTO = produtoPRODUTOLISTA
      INNER JOIN tb0316_Listas ON listaEMPRESALISTA = listaPRODUTOLISTA

      WHERE 
      visivelwebPRODUTO = '1' 
      AND descontinuadoPRODUTO='0' 
      AND padraoEMBALAGEMPRODUTO = '1' 
      AND valorUSUARIOPASTA = 1
      AND padraoEMPRESALISTA='1'

      --AQUI TRAS O CODIGO BUSCADO E O VENDEDOR
      AND (partnumberPRODUTO LIKE  ''+@PRODUTO+'%') 
      AND codigoVENDEDOR = @VENDEDOR
      AND empresaEMPRESALISTA = @EMPRESA


      )TABELA

      ORDER BY partnumberPRODUTO ASC
    `;

    var produto = await sqlServerKnex.raw(query, [
      codigoProduto,
      codigoVendedor.codigoVENDEDOR,
      cliente,
    ]);
  } catch (error) {
    return res.status(500).send(error);
  }

  const valorxquantidade =
    produto[0].precoPRODUTOLISTA * produto[0].quantidadeEMBALAGEMPRODUTO;
  const valoripi = produto[0].precoPRODUTOLISTA * (produto[0].ipiCF / 100);
  const valortotal = valorxquantidade + valoripi;

  const body = {
    propostaITEMPROPOSTA: proposta,
    produtoITEMPROPOSTA: codigoProduto,
    partnumberITEMPROPOSTA: produto[0].partnumberPRODUTO,
    nomeITEMPROPOSTA: produto[0].nomePRODUTO,
    quantidadeITEMPROPOSTA: produto[0].quantidadeEMBALAGEMPRODUTO, // produto[0].PRODUTO,
    embalagempadraoITEMPROPOSTA: produto[0].padraoEMBALAGEMPRODUTO, //produto[0].PRODUTO,
    unidadeITEMPROPOSTA: produto[0].nomeUNIDADEMEDIDA, // produto[0].PRODUTO,
    valorITEMPROPOSTA: produto[0].precoPRODUTOLISTA, // produto[0].PRODUTO,
    valorxquantidadeITEMPROPOSTA: valorxquantidade, // produto[0].PRODUTO,
    ipiITEMPROPOSTA: produto[0].ipiCF, // produto[0].PRODUTO,
    valoripiITEMPROPOSTA: valoripi, // produto[0].PRODUTO,
    valorstITEMPROPOSTA: 0, // produto[0].PRODUTO,
    valortotalITEMPROPOSTA: valortotal,
    ativoITEMPROPOSTA: 1,
  };

  try {
    const itemPropostaMYSQL = await this.create(body);

    if (itemPropostaMYSQL) {
      return res.status(201).json({
        status: true,
        message: "Item de proposta criado com sucesso!",
        itemPropostaMYSQL,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Erro ao criar item de proposta",
        error: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Erro ao criar item de proposta",
      error: error.message,
    });
  }
};
 
// Buscar todos os itens de proposta
exports.findAll = async (limit, offset) => {
  try {
    const itensProposta = await ItensProposta.findAll({
      limit: limit,
      offset: offset,
    });

    return itensProposta;
  } catch (error) {
    return error;
  }
};
*//* 
exports.buscarPropostas = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Limite padrão de 10 registros
  const offset = parseInt(req.query.offset) || 0; // Offset padrão de 0

  try {
    const itensProposta = await this.findAll(limit, offset);

    return res.status(200).json({ status: true, itensProposta });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Erro ao buscar itens de proposta",
      error: error.message,
    });
  }
};

// Buscar um item de proposta por ID
exports.buscarUm = async (id) => {
  try {
    const itemProposta = await ItensProposta.findByPk(id);
    if (!itemProposta) {
      return { status: false, message: "Item de proposta não encontrado" };
    }
    return itemProposta;
  } catch (error) {
    return error;
  }
};

exports.BuscarUmPorProdutoProposta = async (id) => {
  try {
    const itemProposta = await ItensProposta.findOne({
      where: { produtoITEMPROPOSTA: id },
    });

    if (!itemProposta) {
      return { status: false, message: "Item de proposta não encontrado" };
    }

    return itemProposta;
  } catch (error) {
    console.error("Erro ao buscar item por produto e proposta:", error.message);
    return { status: false, error: error.message };
  }
};

exports.buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    // Use o método correto do modelo Sequelize
    const itemProposta = await ItensProposta.findOne({ where: { id } });

    if (!itemProposta) {
      return res
        .status(404)
        .json({ status: false, message: "Item de proposta não encontrado" });
    }

    return res.status(200).json({ status: true, itemProposta });
  } catch (error) {
    console.error("Erro ao buscar item de proposta:", error.message);
    return res.status(500).json({
      status: false,
      message: "Erro ao buscar item de proposta",
      error: error.message,
    });
  }
};

// Atualizar um item de proposta por ID
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const itemProposta = await ItensProposta.findByPk(id);
    if (!itemProposta) {
      return res
        .status(404)
        .json({ status: false, message: "Item de proposta não encontrado" });
    }

    await itemProposta.update(req.body);
    res.status(200).json({
      status: true,
      message: "Item de proposta atualizado com sucesso",
      itemProposta,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao atualizar item de proposta",
      error: error.message,
    });
  }
};

// Deletar um item de proposta por ID
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const itemProposta = await ItensProposta.findByPk(id);
    if (!itemProposta) {
      return res
        .status(404)
        .json({ status: false, message: "Item de proposta não encontrado" });
    }

    await itemProposta.destroy();
    res
      .status(200)
      .json({ status: true, message: "Item de proposta deletado com sucesso" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao deletar item de proposta",
      error: error.message,
    });
  }
}; */

exports.procuraItensDaProposta = async (req, res) => {
  const { codigo } = req.params;

  try {
    const query = `
      SELECT 
        codigoITEMPROPOSTA AS CodigoItem,
        propostaITEMPROPOSTA AS PropostaItem,
        produtoITEMPROPOSTA AS ProdutoItem,
        produto.codigoPRODUTO AS CodigoProduto,
        produto.nomePRODUTO AS NomeProduto,
        produto.partnumberPRODUTO AS PartnumberProduto,
        liquidoITEMPROPOSTA AS LiquidoItem,
        brutoITEMPROPOSTA AS BrutoItem,
        ipiITEMPROPOSTA AS IPIItem,
        valoripiITEMPROPOSTA AS ValorIPIItem,
        valoripitotalITEMPROPOSTA AS ValorIPITotalItem,
        icmsITEMPROPOSTA AS ICMSItem,
        reducaoITEMPROPOSTA AS ReducaoItem,
        basecalculoicmsITEMPROPOSTA AS BaseCalculoICMSItem,
        basecalculoicmstotalITEMPROPOSTA AS BaseCalculoICMSTotalItem,
        valoricmsITEMPROPOSTA AS ValorICMSItem,
        valoricmstotalITEMPROPOSTA AS ValorICMSTotalItem,
        notafiscalITEMPROPOSTA AS NotaFiscalItem,
        tipooperacaoITEMPROPOSTA AS TipoOperacaoItem,
        usuarioITEMPROPOSTA AS UsuarioItem,
        liquidostITEMPROPOSTA AS LiquidoSTItem,
        basecalculoicmsstITEMPROPOSTA AS BaseCalculoICMSSTItem,
        basecalculoicmstotalstITEMPROPOSTA AS BaseCalculoICMSTotalSTItem,
        valoricmsstITEMPROPOSTA AS ValorICMSSTItem,
        valoricmstotalstITEMPROPOSTA AS ValorICMSTotalSTItem
      FROM 
          tb1602_Itens_Proposta AS ItensProposta
      INNER JOIN 
          tb0501_Produtos AS produto 
          ON produtoITEMPROPOSTA = produto.codigoPRODUTO
       INNER JOIN tb1601_Propostas ON codigoPROPOSTA = propostaITEMPROPOSTA
      WHERE 
          (CASE WHEN propostavinculoPROPOSTA IS NULL THEN codigoPROPOSTA ELSE propostavinculoPROPOSTA END) = ?;
    `;
    const result = await sqlServerKnex.raw(query, [codigo]);

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
