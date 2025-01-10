const { sqlServerKnex } = require("../config/sqlserver");
const { Produtos, CF, ImagensProdutos, ProdutosMYSQL } = require("../models");
const { userIsSeller } = require("./empresasController");
/* 
exports.getAll = async (limit, offset) => {
  try {
    const produtos = await Produtos.findAll({
      limit: limit,
      offset: offset,
      include: [
        {
          model: CF,
          as: "cf",
          attributes: [
            "nomeCF",
            "excecaoCF",
            "textofiscalCF",
            "ipiCF",
            "iiCF",
            "pisCF",
            "cofinsCF",
          ],
        },
        {
          model: ImagensProdutos,
          as: "imagens",
          attributes: ["pathIMAGEMPRODUTO"],
        },
      ],
    });

    if (!produtos) {
      return { status: false, error: "Não foi possível encontrar produtos." };
    }

    const produtosTratados = produtos.map((row) => {
      const imagens = row.imagens.map((imagem) => {
        return imagem.pathIMAGEMPRODUTO
          ? imagem.pathIMAGEMPRODUTO.replace(
              "\\\\192.168.40.5\\Tecware\\Site\\Fotos\\Fotos\\",
              "http://rainha7.ddns.com.br/Fotos/Fotos/"
            )
          : null;
      });

      return {
        ...row.toJSON(), // Converte o Sequelize instance para um objeto plano
        imagens,
      };
    });
    return { status: true, response: produtosTratados };
  } catch (error) {
    return { status: false, error };
  }
};

exports.buscarTodosProdutos = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const produtos = await this.getAll(limit, offset);

    if (produtos.status === false) {
      return res
        .status(404)
        .send({ error: produtos.error || "Nenhum produto encontrado" });
    }

    const data = produtos.response;

    return res.send(data);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.BuscarUmPorCodigoProduto = async (codigo) => {
  try {
    const produto = await Produtos.findOne({
      where: { codigoPRODUTO: codigo },
      attributes: { exclude: ["ItensPropostumCodigoITEMPROPOSTA"] }, // Exclui a coluna problemática
    });

    if (!produto) {
      return { status: false, message: "Não foi possível encontrar o produto" };
    }

    return { status: true, produto };
  } catch (error) {
    return { status: false, error };
  }
}; *//* 
exports.getProdutoData = async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 100;
  const empresa = req.params.empresa;
  const vendedor = req.query.vendedor;
  const produto = `${req.query.produto}%`; // Adiciona o curinga diretamente

  
  const partnumber = produto || ""; // Adiciona o curinga diretamente

  try {
    const query = `
      SELECT * 
      FROM ( 
          SELECT  
              codigoPRODUTO AS codigo,
              partnumberPRODUTO AS sku,
              nomePRODUTO AS Descricao,
              alturaPRODUTO AS Altura,
              larguraPRODUTO AS Largura,
              comprimentoPRODUTO AS Comprimento,
              pesobrutoPRODUTO AS Peso,
              CASE  
                  WHEN codigobarrasEMBALAGEMPRODUTO IS NULL THEN 
                      CASE WHEN ean13PRODUTO IS NULL THEN '' ELSE ean13PRODUTO END 
                  WHEN codigobarrasEMBALAGEMPRODUTO = '' THEN '' 
                  ELSE ean13PRODUTO 
              END AS Barras,
              nomeUNIDADEMEDIDA AS UN,
              nomePASTA AS PASTA,
              quantidadeEMBALAGEMPRODUTO,  
              precoPRODUTOLISTA,           
              ROW_NUMBER() OVER (ORDER BY codigoPRODUTO) AS RowNum,
              pathIMAGEMPRODUTO AS IMAGEMPRODUTO,
              qtddisponivelESTOQUE AS QuantidadeDisponível 
          FROM tb0501_Produtos
          INNER JOIN tb0505_Unidades_Medidas ON codigoUNIDADEMEDIDA = undprincipalPRODUTO
          INNER JOIN tb0001_Pastas ON codigoPASTA = pastaPRODUTO
          INNER JOIN tb0504_Embalagens_Produtos ON codigoPRODUTO = produtoEMBALAGEMPRODUTO AND padraoEMBALAGEMPRODUTO = 1
          INNER JOIN tb0545_Embalagens ON codigoEMBALAGEM = embalagemEMBALAGEMPRODUTO
          INNER JOIN tb0509_Produtos_Lista ON codigoPRODUTO = produtoPRODUTOLISTA
          INNER JOIN tb0508_Listas ON codigoLISTA = listaPRODUTOLISTA
          INNER JOIN tb0520_Imagens_Produtos ON codigoPRODUTO = produtosIMAGEMPRODUTO
          INNER JOIN tb0507_CF ON cfPRODUTO = codigoCF
          INNER JOIN tb1201_Estoque ON codigoPRODUTO = produtoESTOQUE 
          INNER JOIN tb0316_Listas ON listaEMPRESALISTA = codigoLISTA AND padraoEMPRESALISTA = 1
          INNER JOIN tb1616_Carteiras ON empresaEMPRESALISTA = empresaCARTEIRA
          INNER JOIN tb1609_Vendedores ON codigoVENDEDOR = vendedorCARTEIRA
		      INNER JOIN tb0206_Pastas ON usuarioassociadoVENDEDOR = usuarioUSUARIOPASTA AND pastaUSUARIOPASTA = codigoPASTA AND valorUSUARIOPASTA = 1
          WHERE lixeiraPRODUTO = 0 
            AND descontinuadoPRODUTO = 0 
            AND descontinuarPRODUTO = 0 
            AND partnumberPRODUTO LIKE ?
            AND empresaEMPRESALISTA = ?
            AND vendedorCARTEIRA = ?
          GROUP BY 
              codigoPRODUTO, 
              partnumberPRODUTO, 
              nomePRODUTO, 
              alturaPRODUTO, 
              larguraPRODUTO, 
              comprimentoPRODUTO, 
              pesobrutoPRODUTO, 
              ean13PRODUTO, 
              nomeUNIDADEMEDIDA, 
              nomePASTA, 
              codigobarrasEMBALAGEMPRODUTO,
              undprincipalPRODUTO,
              quantidadeEMBALAGEMPRODUTO,
              precoPRODUTOLISTA,
              pathIMAGEMPRODUTO,
              qtddisponivelESTOQUE 
      ) AS Result
      --WHERE RowNum > ? AND RowNum <= (? + ?)
      ORDER BY sku ASC;
    `;

    const result = await sqlServerKnex.raw(query, [
      partnumber, // Primeiro binding
      empresa, // Segundo binding
      vendedor, // Terceiro binding
      offset, // Quarto binding
      limit, // Quinto binding
      limit,  // Sexto binding
    ]);

    const formattedResult = result.map((row) => {
      const gtins = row.GTINS ? JSON.parse(row.GTINS) : [];
      const imagem = row.IMAGEMPRODUTO.replace(
        "\\\\192.168.40.5\\Tecware\\Site\\Fotos\\Fotos\\",
        "https://intranet.gruporainhadassete.com.br/Fotos/Fotos/"
      );
      return {
        ...row,
        GTINS: gtins,
        IMAGEMPRODUTO: imagem,
      };
    });

    return res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Erro ao buscar dados do produto:", error);
    return res.status(500).send(error);
  }
};
 */

exports.getProdutoData = async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 100;
  const empresa = req.params.empresa;
  const vendedor = req.query.vendedor;
  const produto = req.query.produto || ""; // Recebe o valor do produto ou vazio

  let query = `
      SELECT * 
      FROM ( 
          SELECT  
              codigoPRODUTO AS codigo,
              partnumberPRODUTO AS sku,
              partnumberPRODUTO+' - '+nomePRODUTO AS Descricao,
              alturaPRODUTO AS Altura,
              larguraPRODUTO AS Largura,
              comprimentoPRODUTO AS Comprimento,
              pesobrutoPRODUTO AS Peso,
			        ipiCF AS IPI,
              CASE  
                  WHEN codigobarrasEMBALAGEMPRODUTO IS NULL THEN 
                      CASE WHEN ean13PRODUTO IS NULL THEN '' ELSE ean13PRODUTO END 
                  WHEN codigobarrasEMBALAGEMPRODUTO = '' THEN '' 
                  ELSE ean13PRODUTO 
              END AS Barras,
              nomeUNIDADEMEDIDA AS UN,
              nomePASTA AS PASTA,
              quantidadeEMBALAGEMPRODUTO,  
              precoPRODUTOLISTA,           
              ROW_NUMBER() OVER (ORDER BY codigoPRODUTO) AS RowNum,
              pathIMAGEMPRODUTO AS IMAGEMPRODUTO,
              qtddisponivelESTOQUE AS QuantidadeDisponível 
          FROM tb0501_Produtos
          INNER JOIN tb0505_Unidades_Medidas ON codigoUNIDADEMEDIDA = undprincipalPRODUTO
          INNER JOIN tb0001_Pastas ON codigoPASTA = pastaPRODUTO
          INNER JOIN tb0504_Embalagens_Produtos ON codigoPRODUTO = produtoEMBALAGEMPRODUTO AND padraoEMBALAGEMPRODUTO = 1
          INNER JOIN tb0545_Embalagens ON codigoEMBALAGEM = embalagemEMBALAGEMPRODUTO
          INNER JOIN tb0509_Produtos_Lista ON codigoPRODUTO = produtoPRODUTOLISTA
          INNER JOIN tb0508_Listas ON codigoLISTA = listaPRODUTOLISTA
          INNER JOIN tb0520_Imagens_Produtos ON codigoPRODUTO = produtosIMAGEMPRODUTO
          INNER JOIN tb0507_CF ON cfPRODUTO = codigoCF
          INNER JOIN tb1201_Estoque ON codigoPRODUTO = produtoESTOQUE 
          INNER JOIN tb0316_Listas ON listaEMPRESALISTA = codigoLISTA AND padraoEMPRESALISTA = 1
          INNER JOIN tb1616_Carteiras ON empresaEMPRESALISTA = empresaCARTEIRA
          INNER JOIN tb1609_Vendedores ON codigoVENDEDOR = vendedorCARTEIRA
		      INNER JOIN tb0206_Pastas ON usuarioassociadoVENDEDOR = usuarioUSUARIOPASTA AND pastaUSUARIOPASTA = codigoPASTA AND valorUSUARIOPASTA = 1
          WHERE lixeiraPRODUTO = 0 
            AND descontinuadoPRODUTO = 0 
            AND descontinuarPRODUTO = 0 
  `;

  const bindings = [];

  // Adiciona o filtro do produto se fornecido
  if (produto) {
    query += ` AND partnumberPRODUTO LIKE ? `;
    bindings.push(`${produto}%`);
  }

  // Adiciona os outros filtros obrigatórios
  query += `
            AND empresaEMPRESALISTA = ?
            AND vendedorCARTEIRA = ?
          GROUP BY 
              codigoPRODUTO, 
              partnumberPRODUTO, 
              nomePRODUTO, 
              alturaPRODUTO, 
              larguraPRODUTO, 
              comprimentoPRODUTO, 
              pesobrutoPRODUTO, 
              ean13PRODUTO, 
              nomeUNIDADEMEDIDA, 
              nomePASTA,
              ipiCF,
              codigobarrasEMBALAGEMPRODUTO,
              undprincipalPRODUTO,
              quantidadeEMBALAGEMPRODUTO,
              precoPRODUTOLISTA,
              pathIMAGEMPRODUTO,
              qtddisponivelESTOQUE 
      ) AS Result
      ORDER BY sku ASC
      OFFSET ? ROWS FETCH NEXT ? ROWS ONLY;`;

  bindings.push(empresa, vendedor, offset, limit);

  try {
    const result = await sqlServerKnex.raw(query, bindings);

    // Formatação do resultado, se necessário
    const formattedResult = result.map((row) => {
      const imagem = row.IMAGEMPRODUTO.replace(
        "\\\\192.168.40.5\\Tecware\\Site\\Fotos\\Fotos\\",
        "https://intranet.gruporainhadassete.com.br/Fotos/Fotos/"
      );
      return {
        ...row,
        IMAGEMPRODUTO: imagem,
      };
    });

    return res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Erro ao buscar dados do produto:", error);
    return res.status(500).send(error.message);
  }
};


 
/* 
exports.buscarArvoresDeProdutos = async (req, res) => {
  const { produto } = req.params;

  try {
    const query = `
      SELECT 
        principalSUBPRODUTO,
        partnumberPRODUTO, 
        nomePRODUTO, 
        nomeUNIDADEMEDIDA, 
        qtdeSUBPRODUTO, 
        custounitarioSUBPRODUTO, 
        custototalSUBPRODUTO 
      FROM tb0502_SubProdutos 
      INNER JOIN tb0501_Produtos ON subprodutoSUBPRODUTO = codigoPRODUTO
      INNER JOIN tb0505_Unidades_Medidas ON undprincipalPRODUTO = codigoUNIDADEMEDIDA
      WHERE produtoSUBPRODUTO = ? 
    `;

    const result = await sqlServerKnex.raw(query, [produto]);

    if (!result || result.length <= 0) {
      return res
        .status(404)
        .send({ error: "Não foi possível encontrar produtos!" });
    }

    return res.send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.buscarProdutoContidosEmUmaArvore = async (req, res) => {
  const { produto } = req.params;

  try {
    const query = `
      SELECT 
        principalSUBPRODUTO,
        partnumberPRODUTO, 
        nomePRODUTO, 
        nomeUNIDADEMEDIDA, 
        qtdeSUBPRODUTO, 
        custounitarioSUBPRODUTO, 
        custototalSUBPRODUTO 
      FROM tb0502_SubProdutos 
      INNER JOIN tb0501_Produtos on produtoSUBPRODUTO = codigoPRODUTO
      INNER JOIN tb0505_Unidades_Medidas on undprincipalPRODUTO = codigoUNIDADEMEDIDA
      WHERE subprodutoSUBPRODUTO = ?;
  `;

    const result = await sqlServerKnex.raw(query, [produto]);

    if (!result || result.length <= 0) {
      return res
        .status(404)
        .send({ error: "Não foi possível encontrar produtos!" });
    }

    return res.send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.buscarArvoreDeProcessos = async (req, res) => {
  const { produto } = req.params;

  try {
    const query = `
      SELECT 
        nomePROCESSO, 
        observacaoSUBPROCESSO,
        unidade.nomeUNIDADEMEDIDA AS [UND de Custo], 
        quantidadeSUBPROCESSO,
        unidadetempo.nomeUNIDADEMEDIDA AS [UND de Tempo], 
        tempoSUBPROCESSO, 
        custototalSUBPROCESSO, 
        ordemSUBPROCESSO 
      FROM tb0512_SupProcessos 
      INNER JOIN tb1305_Processos ON processoSUBPROCESSO = codigoPROCESSO
      INNER JOIN tb0505_Unidades_Medidas AS unidade ON unidadeSUBPROCESSO = unidade.codigoUNIDADEMEDIDA
      INNER JOIN tb0505_Unidades_Medidas AS unidadetempo ON unidadetempoSUBPROCESSO = unidadetempo.codigoUNIDADEMEDIDA
      WHERE produtoSUBPROCESSO = ? 
      ORDER BY ordemSUBPROCESSO asc
  `;

    const result = await sqlServerKnex.raw(query, [produto]);

    if (!result || result.length <= 0) {
      return res
        .status(404)
        .send({ error: "Não foi possível encontrar produtos!" });
    }

    return res.send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.buscarTabelaDePrecos = async (req, res) => {
  const { produto } = req.params;

  try {
    const query = `
      SELECT 
        nomeLISTA, 
        observacaoLISTA, 
        precoPRODUTOLISTA, 
        descontoPRODUTOLISTA, 
        precobrutoPRODUTOLISTA, 
        precorepPRODUTO 
      FROM tb0509_Produtos_Lista
      INNER JOIN tb0508_Listas ON codigoLISTA = listaPRODUTOLISTA
      INNER JOIN tb0501_Produtos ON produtoPRODUTOLISTA = codigoPRODUTO
      WHERE produtoPRODUTOLISTA = ?
  `;

    const result = await sqlServerKnex.raw(query, [produto]);

    if (!result || result.length <= 0) {
      return res
        .status(404)
        .send({ error: "Não foi possível encontrar produtos!" });
    }

    return res.send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
}; */

