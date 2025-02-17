const {
  ItensPropostaMysql,
  ItensImportPropostaMysql,
  PropostasMYSQL,
  ProdutosMYSQL,
  Produtos,
} = require("../models");
const { userIsSeller } = require("./empresasController");
const { sqlServerKnex } = require("../config/sqlserver");
const { config } = require("dotenv");

// Busca itens por proposta
exports.getByProposta = async (req, res) => {
  try {
    const { proposta } = req.params;

    // Busca os itens com base na proposta informada
    const itens = await ItensPropostaMysql.findAll({
      where: { propostaITEMPROPOSTA: proposta },
    });

    // Verifica se encontrou itens
    if (itens.length === 0) {
      return res
        .status(404)
        .json({ error: "Itens não encontrados para a proposta informada" });
    }

    res.status(200).json(itens);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar itens: " + error.message });
  }
};

// Cria um novo item
exports.create = async (req, res) => {
  var {
    proposta,
    produto,
    partnumber,
    nomeitem,
    quantidade,
    embalagempadrao,
    unidade,
    valor,
    ipi,
    ativo,
  } = req.body;

  console.log(req.body);

  if (quantidade % embalagempadrao !== 0) {
    const diferenca = quantidade % embalagempadrao;
    const falta = embalagempadrao - diferenca;
    quantidade = quantidade + falta;
  }

  const itemJaExiste = await ItensPropostaMysql.findOne({
    where: {
      produtoITEMPROPOSTA: produto,
      propostaITEMPROPOSTA: proposta,
    },
  });

  if (itemJaExiste) {
    return res.status(404).send({
      status: false,
      error: "item_duplicado",
      mensagem: "O Produto já existe nessa proposta!",
    });
  }

  try {
    const novoItem = await ItensPropostaMysql.create(
      {
        propostaITEMPROPOSTA: proposta,
        produtoITEMPROPOSTA: produto,
        partnumberITEMPROPOSTA: partnumber,
        nomeITEMPROPOSTA: nomeitem,
        quantidadeITEMPROPOSTA: quantidade,
        embalagempadraoITEMPROPOSTA: embalagempadrao,
        unidadeITEMPROPOSTA: unidade,
        valorITEMPROPOSTA: valor,
        valorxquantidadeITEMPROPOSTA: valor * quantidade,
        ipiITEMPROPOSTA: ipi,
        valoripiITEMPROPOSTA: ((valor * ipi) / 100) * quantidade,
        valorstITEMPROPOSTA: 0,
        valortotalITEMPROPOSTA:
          valor * quantidade + ((valor * ipi) / 100) * quantidade,
        ativoITEMPROPOSTA: ativo,
      },
      { returning: true }
    );

    return res.status(201).json(novoItem);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Erro ao criar item: " + error.message });
  }
};

// Atualiza um item por ID
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ItensPropostaMysql.findByPk(id);

    // Verifica se o item existe
    if (!item) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    if (req.body.quantidadeITEMPROPOSTA) {
      var quantidade = req.body.quantidadeITEMPROPOSTA;
      const embalagemPadrao = item.embalagempadraoITEMPROPOSTA;
      var valorxquantidade = req.body.valorxquantidadeITEMPROPOSTA;
      var valoripi = req.body.valoripiITEMPROPOSTA;
      var valortotal = req.body.valortotalITEMPROPOSTA;

      if (quantidade % embalagemPadrao !== 0) {
        const diferenca = quantidade % embalagemPadrao;
        console.log(`Diferença detectada: ${diferenca}`);
        const falta = embalagemPadrao - diferenca;
        quantidade = quantidade + falta;

        console.log("quantidade final: ", quantidade);
      }
      if (item.ipi != 0) {
        valorxquantidade = item.valorITEMPROPOSTA * quantidade;
        valoripi =
          ((item.valorITEMPROPOSTA * item.ipiITEMPROPOSTA) / 100) * quantidade;
        valortotal =
          item.valorITEMPROPOSTA * quantidade +
          ((item.valorITEMPROPOSTA * item.ipiITEMPROPOSTA) / 100) * quantidade;
      } else {
        valorxquantidade = item.valorITEMPROPOSTA * quantidade;
        valoripi = 0;
        valortotal = item.valorITEMPROPOSTA * quantidade;
      }
    }

    req.body.quantidadeITEMPROPOSTA = quantidade;
    req.body.valorxquantidadeITEMPROPOSTA = valorxquantidade;
    req.body.valoripiITEMPROPOSTA = valoripi;
    req.body.valortotalITEMPROPOSTA = valortotal;
    await item.update(req.body);

    return res.status(200).json({
      message: "Item atualizado com sucesso.",
      item,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar item: " + error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ItensPropostaMysql.findByPk(id);

    if (!item) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    await item.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar item: " + error.message });
  }
};

exports.importarItens = async (req, res) => {
  const json = req.body;
  const usuario = await userIsSeller(req);

  try {
    const itens = json.forEach(async (prod, index) => {
      if (
        prod.produto === undefined ||
        prod.proposta === undefined ||
        prod.quantidade === undefined
      ) {
        return res.status(500).send({ error: "Há campos não informado" });
      }

      if (prod.produto.includes("ETE ")) {
        prod.produto = prod.produto.replace("ETE ", "").trim();
      }

      await ItensImportPropostaMysql.create({
        itemITEMPROPOSTA: index + 1,
        produtoITEMPROPOSTA: prod.produto.trim(),
        quantidadeITEMPROPOSTA: prod.quantidade,
        usuarioITEMPROPOSTA: usuario.codigoVENDEDOR,
        pedidoITEMPROPOSTA: prod.proposta,
        gerouITEMPROPOSTA: 0,
      });
    });

    return res.status(200).json(itens); // Retorna os itens no formato JSON
  } catch (error) {
    console.error("Erro ao processar itens:", error.message);
    return res.status(500).json({ error: "Erro ao processar itens." });
  }
};

exports.verificaItensNaoImportados = async (req, res) => {
  const { proposta } = req.params;

  try {
    const verifica = await ItensImportPropostaMysql.count({
      where: {
        pedidoITEMPROPOSTA: proposta,
        gerouITEMPROPOSTA: 0,
      },
    });

    if (verifica) {
      return res.send({
        status: true,
        mensagem: "Ainda existem itens não importados",
        pendentes: verifica,
      });
    } else {
      return res.send({ status: false, mensagem: "Não existem pendências" });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.criar = async (
  proposta,
  produto,
  partnumber,
  nomeitem,
  quantidade,
  embalagempadrao,
  unidade,
  valor,
  ipi,
  ativo
) => {
  if (quantidade % embalagempadrao !== 0) {
    const diferenca = quantidade % embalagempadrao;
    const falta = embalagempadrao - diferenca;
    quantidade = quantidade + falta;
  }

  try {
    const novoItem = await ItensPropostaMysql.create(
      {
        propostaITEMPROPOSTA: proposta,
        produtoITEMPROPOSTA: produto,
        partnumberITEMPROPOSTA: partnumber,
        nomeITEMPROPOSTA: nomeitem,
        quantidadeITEMPROPOSTA: quantidade,
        embalagempadraoITEMPROPOSTA: embalagempadrao,
        unidadeITEMPROPOSTA: unidade,
        valorITEMPROPOSTA: valor,
        valorxquantidadeITEMPROPOSTA: valor * quantidade,
        ipiITEMPROPOSTA: ipi,
        valoripiITEMPROPOSTA: ((valor * ipi) / 100) * quantidade,
        valorstITEMPROPOSTA: 0,
        valortotalITEMPROPOSTA:
          valor * quantidade + ((valor * ipi) / 100) * quantidade,
        ativoITEMPROPOSTA: ativo,
      },
      { returning: true }
    );

    return novoItem;
  } catch (error) {
    return error.message;
  }
};

const getProdutoData = async (produto, vendedor, empresa) => {
  console.log(produto, vendedor, empresa);
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
            AND partnumberPRODUTO = ?
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
      `;

  try {
    const result = await sqlServerKnex.raw(query, [produto, empresa, vendedor]);

    // console.log(result);
    return result;
  } catch (error) {
    console.error("Erro ao buscar dados do produto:", error);
    return error;
  }
};

exports.processaItensImportadosViaExcel = async () => {
  try {
    var buscaItensNaoProcessados = await ItensImportPropostaMysql.findAll({
      where: { gerouITEMPROPOSTA: 0 },
    });

    if (!buscaItensNaoProcessados || buscaItensNaoProcessados.length === 0) {
      console.log("-> Nenhum item pendente");
      return { mensagem: "Nenhum item pendente" };
    }

    let errors = []; // Armazenar erros para envio no final

    for (let itensNaoProcessados of buscaItensNaoProcessados) {
      let pedido = itensNaoProcessados.pedidoITEMPROPOSTA;
      let proposta;


      try {
        proposta = await PropostasMYSQL.findByPk(pedido);
        if (!proposta) {
          errors.push(`Proposta não encontrada para o pedido ${pedido}`);
          continue; // Pular para o próximo item sem retornar resposta
        }
      } catch (error) {
        errors.push("Erro ao buscar proposta: " + error);
        continue; // Pular para o próximo item sem retornar resposta
      }

      
      var produtos = await getProdutoData(
        itensNaoProcessados.produtoITEMPROPOSTA,
        proposta.vendedorPROPOSTA,
        proposta.clientePROPOSTA
      );
      
      if (!produtos || produtos.length == 0 ) {
        errors.push(
          `Nenhum produto encontrado para o Pedido: ${pedido}, Produto: ${itensNaoProcessados.produtoITEMPROPOSTA}`
        );
        
        await ItensImportPropostaMysql.update(
          { gerouITEMPROPOSTA: 2 },
          {
            where: {
              codigoITEMPROPOSTA: itensNaoProcessados.codigoITEMPROPOSTA,
            },
          }

        );
        
        continue;
      }
      
      for (let produto of produtos) {
        // const buscaSeProdutoJaExiste = await ItensImportPropostaMysql.findOne(
          const buscaSeProdutoJaExiste = await ItensPropostaMysql.findOne({
            where: {
              propostaITEMPROPOSTA: itensNaoProcessados.pedidoITEMPROPOSTA,
              partnumberITEMPROPOSTA: itensNaoProcessados.produtoITEMPROPOSTA,
            },
          });
          // console.log("PRODUTO JÁ EXISTE: ", buscaSeProdutoJaExiste);
          // continue;

        if (buscaSeProdutoJaExiste) {
          console.log(
            `O produto ${itensNaoProcessados.produtoITEMPROPOSTA} já existe na proposta ${itensNaoProcessados.pedidoITEMPROPOSTA}`
          );

          await ItensImportPropostaMysql.update(
            { gerouITEMPROPOSTA: 2 },
            {
              where: {
                codigoITEMPROPOSTA: itensNaoProcessados.codigoITEMPROPOSTA,
              },
            }
          );
          
          errors.push(
            `O produto ${itensNaoProcessados.codigoITEMPROPOSTA} está duplicado no excel importado, portanto estamos removendo as duplicatas`
          );
          continue;
        }

        let body = {
          proposta: proposta.codigoPROPOSTA,
          produto: produto.codigo,
          partnumber: produto.sku,
          nomeitem: produto.Descricao,
          quantidade: itensNaoProcessados.quantidadeITEMPROPOSTA,
          embalagempadrao: produto.quantidadeEMBALAGEMPRODUTO,
          unidade: produto.UN,
          valor: produto.precoPRODUTOLISTA,
          ipi: produto.IPI,
          ativo: 1,
        };

        try {
          await this.criar(
            body.proposta,
            body.produto,
            body.partnumber,
            body.nomeitem,
            body.quantidade,
            body.embalagempadrao,
            body.unidade,
            body.valor,
            body.ipi,
            body.ativo
          );
  
          await ItensImportPropostaMysql.update(
            { gerouITEMPROPOSTA: 1 },
            {
              where: {
                codigoITEMPROPOSTA: itensNaoProcessados.codigoITEMPROPOSTA,
              },
            }
          );
        } catch (error) {
          errors.push(`${body.proposta} Não atualizado`);
          continue;
        }
      }
    }

    // Após o laço, se houve erros, retornamos uma resposta de erro com as mensagens acumuladas
    // if (errors.length > 0) {
    //   return { errors };
    // }

    // Caso tudo tenha sido processado corretamente
    return { mensagem: "Processamento concluído com sucesso.", errors };
  } catch (error) {
    return "Erro inesperado: " + error;
  }
};

exports.deletaItensTabelaTemporaria = async () => {
  console.log("Deletando todos os itens da tabela temporária!");
  try {
    await ItensImportPropostaMysql.delete();
    console.log("Itens deletados com sucesso!");
    return;
  } catch (error) {
    return error;
  }
};
