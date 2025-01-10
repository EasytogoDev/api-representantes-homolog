const { sqlServerKnex } = require("../config/sqlserver");
const {
  sqlServerSequelize,
  Vendedores,
  Propostas,
  PropostasMYSQL,
  ItensPropostaMYSQL,
  Temp1603WebPropostas,
  Temp1604ItensWebProposta,
  Empresa,
} = require("../models");
const jwt = require("jsonwebtoken");
const {
  obterTransportadorasPorEmpresa,
} = require("./transportadorasController");
const { obterClientePeloId } = require("./empresasController");
const { format } = require("date-fns");

async function userIsSeller(req) {
  const token = req.headers["authorization"];

  // Verifica se o token está presente
  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const newToken = token.replace("Bearer ", "");
  const decoded = jwt.decode(newToken);

  // Verifica se o token contém o campo `codigo`
  if (!decoded || !decoded.codigo) {
    throw new Error("Invalid token or missing 'codigo'");
  }

  const usuario = decoded.codigo;

  // Busca o vendedor associado ao usuário
  const vendedor = await Vendedores.findOne({
    where: {
      usuarioassociadoVENDEDOR: usuario,
    },
  });

  // Valida se o vendedor foi encontrado
  if (!vendedor) {
    throw new Error("Vendedor não encontrado para o usuário fornecido");
  }

  const codigoVendedor = vendedor.codigoVENDEDOR;

  return { codigoVendedor, usuario };
}

exports.getPropostas = async (req, res) => {
  try {
    const usuario = req.user.codigo; // Pega o código do usuário do JWT token

    if (!usuario) {
      return res.status(400).send({ error: "Usuário não definido no token" });
    }

    const wms = req.params.wms;
    const limit = parseInt(req.query.limit) || 50; // Limite padrão de 50 registros
    const offset = parseInt(req.query.offset) || 0; // Offset padrão de 0

    let andClause = wms ? `AND prop8PROPOSTA = ${wms}` : "";

    const vendedorAssociado = await Vendedores.findOne({
      where: { usuarioassociadoVENDEDOR: usuario },
      attributes: ["codigoVENDEDOR"],
    });

    let whereClause =
      vendedorAssociado && vendedorAssociado.codigoVENDEDOR
        ? `WHERE vendedorCARTEIRA = ${vendedorAssociado.codigoVENDEDOR} AND lixeiraPROPOSTA = 0 ${andClause}`
        : `WHERE lixeiraPROPOSTA = 0 ${andClause}`;

    const propostas = await sqlServerSequelize.query(
      `
      SELECT *
      FROM (
        SELECT
          numeroPROPOSTA, 
          razaoEMPRESA, 
          datacriacaoPROPOSTA,
          statusPROPOSTA,
          liquidoPROPOSTA,
          ipiPROPOSTA,
          brutoPROPOSTA,
          pesoliquidoPROPOSTA,
          ROW_NUMBER() OVER (ORDER BY codigoPROPOSTA DESC) AS RowNum
        FROM tb1601_Propostas
        INNER JOIN tb0301_Empresas ON codigoEMPRESA = clientePROPOSTA
        LEFT JOIN tb1616_Carteiras ON codigoEMPRESA = empresaCARTEIRA
        ${whereClause}
      ) AS PropostasPaginadas
      WHERE RowNum > ${offset} AND RowNum <= ${offset + limit}
      ORDER BY RowNum ASC
      `,
      { type: sqlServerSequelize.QueryTypes.SELECT }
    );

    return res.status(200).json(propostas);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error.message });
  }
};

exports.findAll = async (req, res) => {
  const wms = req.query.wms;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const propostas = await Propostas.findAll({
      where: wms ? { wms: wms } : {},
      limit: limit,
      offset: offset,
    });

    const propostasAjustadas = propostas.map((proposta) => {
      const novaProposta = {};
      Object.keys(proposta.dataValues).forEach((key) => {
        const chaveAjustada = key.replace("PROPOSTA", "");
        novaProposta[chaveAjustada] = proposta[key];
      });

      novaProposta.wms = novaProposta.prop8;
      delete novaProposta.prop8;

      return novaProposta;
    });

    res.status(200).json({
      status: true,
      propostas: propostasAjustadas,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao buscar propostas",
      error: error.message,
    });
  }
};

// Buscar uma proposta por ID
exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const proposta = await Propostas.findByPk(id);
    if (!proposta) {
      return res
        .status(404)
        .json({ status: false, message: "Proposta não encontrada" });
    }
    return res.status(200).json({ status: true, proposta });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Erro ao buscar a proposta",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;

  const campoMapeado = {
    descricao: "descricaoPROPOSTA",
    valor: "valorPROPOSTA",
    pedido: "pedidoPROPOSTA",
    usuario: "usuarioPROPOSTA",
    vendedor: "vendedorPROPOSTA",
    cliente: "clientePROPOSTA",
    data: "dataPROPOSTA",
    observacao: "observacaoPROPOSTA",
    envio: "envioPROPOSTA",
    lixeira: "lixeiraPROPOSTA",
    ativo: "ativoPROPOSTA",
  };

  const cliente = req.body.cliente;
  const transportadora = await obterTransportadorasPorEmpresa(cliente);
  const nome = await obterClientePeloId(cliente);

  const dadosAtualizados = Object.keys(req.body).reduce((acc, key) => {
    const campoTabela = campoMapeado[key];
    if (campoTabela) {
      acc[campoTabela] = req.body[key];
    }
    return acc;
  }, {});

  const dadosParaAtualizar = {
    ...dadosAtualizados,
    transportadoraPROPOSTA: transportadora[0].codigo,
    nometransportadoraPROPOSTA: transportadora[0].FANTASIA,
    nomePROPOSTA: nome[0].RAZAO,
  };

  try {
    const proposta = await Propostas.findByPk(id);
    if (!proposta) {
      return res
        .status(404)
        .json({ status: false, message: "Proposta não encontrada" });
    }

    await Propostas.update(dadosParaAtualizar, {
      where: { codigoPROPOSTA: id },
    });

    const propostaAtualizada = await Propostas.findByPk(id);
    res.status(200).json({
      status: true,
      message: "Proposta atualizada com sucesso",
      proposta: propostaAtualizada,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao atualizar a proposta",
      error: error.message,
    });
  }
};

// Deletar uma proposta por ID
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const proposta = await Propostas.findByPk(id);
    if (!proposta) {
      return res
        .status(404)
        .json({ status: false, message: "Proposta não encontrada" });
    }

    await proposta.destroy();
    res
      .status(200)
      .json({ status: true, message: "Proposta deletada com sucesso" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Erro ao deletar a proposta",
      error: error.message,
    });
  }
};

exports.getPropostasGrouped = async (req, res) => {
  try {
    const { codigoVendedor } = await userIsSeller(req);

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const propostasQuery = `
      WITH CTE_PrimeiraData AS (
        SELECT 
            CASE 
                WHEN propostavinculoPROPOSTA IS NULL THEN codigoPROPOSTA 
                ELSE propostavinculoPROPOSTA 
            END AS PROPOSTA_PRINCIPAL,
            MIN(datacriacaoPROPOSTA) AS DATA_PRIMEIRA
        FROM 
            tb1601_Propostas
        GROUP BY 
            CASE 
                WHEN propostavinculoPROPOSTA IS NULL THEN codigoPROPOSTA 
                ELSE propostavinculoPROPOSTA 
            END
      ),
      CTE_Propostas AS (
        SELECT 
          (CASE
            WHEN MIN(p.propostavinculoPROPOSTA) IS NULL THEN MIN(p.codigoPROPOSTA)
            ELSE MIN(p.propostavinculoPROPOSTA)
          END) AS codigo,
          SUM(p.liquidoPROPOSTA) AS liquido,
          SUM(p.ipiPROPOSTA) AS ipi,
          SUM(p.icmsstPROPOSTA) AS icmsst,
          SUM(p.brutoPROPOSTA) AS bruto,
          MIN(p.datacriacaoPROPOSTA) AS datacriacao,
          c.nomeCIDADE AS cidade,
          e.estadoENDERECO AS estado,
          p.clientePROPOSTA AS cliente,
          emp.razaoEMPRESA AS razao,
          sp.nomeSTATUSPROPOSTA AS status,
          p.propostavinculoPROPOSTA AS propostavinculo,
          MIN(p.observacaoPROPOSTA) AS observacao,
          d.DATA_PRIMEIRA AS data_primeira,
          SUM(p.descontosPROPOSTA) AS desconto,
          SUM(p.acrescimosPROPOSTA) AS acrescimo,
          TRANSPORTADORA.nomeEMPRESA AS transportadora,
          descricaoFRETENFE AS tipo_frete
        FROM 
          tb1601_Propostas p
        INNER JOIN 
          CTE_PrimeiraData d ON 
              CASE 
                  WHEN p.propostavinculoPROPOSTA IS NULL THEN p.codigoPROPOSTA 
                  ELSE p.propostavinculoPROPOSTA 
              END = d.PROPOSTA_PRINCIPAL
        INNER JOIN 
          tb0302_Enderecos e 
          ON p.clientePROPOSTA = e.empresaENDERECO
          AND e.padraoENDERECO = 1
          AND e.tipoENDERECO = 4
        INNER JOIN 
          tb0703_Cidades c
          ON e.cidadeENDERECO = c.codigoCIDADE
        INNER JOIN 
          tb0301_Empresas emp
          ON p.clientePROPOSTA = emp.codigoEMPRESA
        INNER JOIN 
          tb1612_Status_Proposta sp
          ON p.statusPROPOSTA = sp.codigoSTATUSPROPOSTA
        LEFT JOIN 
          tb0301_Empresas AS TRANSPORTADORA 
          ON p.transportadoraPROPOSTA = TRANSPORTADORA.codigoEMPRESA
        INNER JOIN 
          tb1556_FretesNFe ON codigoFRETENFE = p.fretetipoPROPOSTA
        WHERE 
          p.vendedorPROPOSTA = ?
        GROUP BY 
          p.propostavinculoPROPOSTA,
          c.nomeCIDADE,
          e.estadoENDERECO,
          p.clientePROPOSTA,
          emp.razaoEMPRESA,
          sp.nomeSTATUSPROPOSTA,
          d.DATA_PRIMEIRA,
          TRANSPORTADORA.nomeEMPRESA,
          descricaoFRETENFE
      )
      SELECT * FROM CTE_Propostas
      ORDER BY codigo DESC
      OFFSET ? ROWS FETCH NEXT ? ROWS ONLY;
    `;

    const propostas = await sqlServerKnex.raw(propostasQuery, [
      codigoVendedor,
      offset,
      limit,
    ]);

    return res.status(200).send(propostas);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error.message });
  }
};

exports.criarPropostaSistema = async (req, res) => {
  const { codigo } = req.params; // Código da proposta passado como parâmetro

  //return res.send({mensagem: "Já estamos criando sua proposta, aguarde."})

  try {
    console.log(`Iniciando a sincronização da proposta: ${codigo}`);

    // Buscar a proposta no MySQL
    const proposta = await PropostasMYSQL.findOne({
      where: { codigoPROPOSTA: codigo },
      include: [
        {
          model: ItensPropostaMYSQL,
          as: "itens",
        },
      ],
    });

    if (!proposta) {
      console.error(`Proposta ${codigo} não encontrada no MySQL.`);
      return res.status(404).json({
        mensagem: `Proposta ${codigo} não encontrada no MySQL.`,
      });
    }

    console.log("Proposta encontrada no MySQL:", proposta);

    // Query para inserir a proposta no SQL Server e obter o ID gerado
    const queryProposta = `
      INSERT INTO web1603_Web_Propostas 
      (
        referenciaWEBPROPOSTA, 
        propostaclienteWEBPROPOSTA, 
        vendedorWEBPROPOSTA, 
        clienteWEBPROPOSTA, 
        dataWEBPROPOSTA, 
        observacaoWEBPROPOSTA,
        transportadoraWEBPROPOSTA,
        geroupropostaWEBPROPOSTA
      ) 
      OUTPUT INSERTED.codigoWEBPROPOSTA
      VALUES
      (?, ?, ?, ?, ?, ?, ?, '0');
    `;

    const data = proposta.dataPROPOSTA
      .toISOString()
      .slice(0, 19)
      .replace("T", " "); // Formatar a data
    const codigoP = proposta.codigoPROPOSTA;
    const pedido = proposta.pedidoPROPOSTA || "";
    const vendedor = proposta.vendedorPROPOSTA;
    const cliente = proposta.clientePROPOSTA;
    const obs = proposta.observacaoPROPOSTA || "";
    const transp = proposta.transportadoraPROPOSTA;

    const result = await sqlServerKnex.raw(queryProposta, [
      codigoP,
      pedido,
      vendedor,
      cliente,
      data,
      obs,
      transp,
    ]);

    const novaPropostaId = result[0].codigoWEBPROPOSTA;

    console.log("Proposta criada no SQL Server com ID:", novaPropostaId);

    // Inserir os itens da proposta
    const queryItens = `
      INSERT INTO web1604_Itens_Web_Proposta 
      (
        referenciapropostaITEMWEBPROPOSTA,
        referenciaITEMWEBPROPOSTA, 
        propostaITEMWEBPROPOSTA, 
        produtoITEMWEBPROPOSTA, 
        quantidadeITEMWEBPROPOSTA,
        ordemITEMWEBPROPOSTA
      )
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const itens = await ItensPropostaMYSQL.findAll({
      where: {
        propostaITEMPROPOSTA: codigoP,
      },
    });

    let totalItensInseridos = 0;
    for (const item of itens) {
      await sqlServerKnex.raw(queryItens, [
        novaPropostaId,
        item.codigoITEMPROPOSTA,
        novaPropostaId,
        item.produtoITEMPROPOSTA,
        item.quantidadeITEMPROPOSTA,
        item.embalagempadraoITEMPROPOSTA,
      ]);
      totalItensInseridos++;
    }

    console.log(`Itens inseridos no SQL Server: ${totalItensInseridos}`);

    try {
      await PropostasMYSQL.update(
        {
          envioPROPOSTA: 1,
          ativoPROPOSTA: 0,
          lixeiraPROPOSTA: 1,
        },
        {
          where: {
            codigoPROPOSTA: codigo,
          },
        }
      );
    } catch (error) {
      return res
        .status(500)
        .send({ error: "Não foi possível atualizar a proposta" });
    }

    // Executar procedure, se necessário
    try {
      const procedureQuery = `EXEC sps1601_Insere_Proposta_Web_rainha ?`;
      await sqlServerKnex.raw(procedureQuery, [novaPropostaId]);
    } catch (error) {
      return res.status(500).send("Erro ao executar procedure");
    }

    // Resposta de sucesso
    return res.status(201).json({
      status: "1",
      mensagem: "Proposta inserida com sucesso",
      Itens: totalItensInseridos,
    });
  } catch (error) {
    console.error("Erro ao sincronizar proposta:", error.message);

    // Resposta de erro
    return res.status(500).json({
      status: "3",
      mensagem: "Erro ao tentar inserir proposta",
      erro: error.message,
    });
  }
};

/*

// // Inserir a proposta no SQL Server
    // const novaProposta = await Temp1603WebPropostas.create({
    //   referenciaWEBPROPOSTA: proposta.codigoPROPOSTA,
    //   propostaclienteWEBPROPOSTA: proposta.nomePROPOSTA || "",
    //   vendedorWEBPROPOSTA: proposta.vendedorPROPOSTA,
    //   clienteWEBPROPOSTA: proposta.clientePROPOSTA,
    //   dataWEBPROPOSTA: "2024-12-05 17:21:21", // Data formatada no padrão aceito
    //   observacaoWEBPROPOSTA: proposta.observacaoPROPOSTA || "",
    //   transportadoraWEBPROPOSTA: proposta.transportadoraPROPOSTA,
    //   geroupropostaWEBPROPOSTA: 0,
    // });

    console.log("Proposta criada no SQL Server:", novaProposta);

    // Inserir itens associados
    for (const item of proposta.itens) {
      await Temp1604ItensWebProposta.create({
        referenciapropostaITEMWEBPROPOSTA: novaProposta.codigoWEBPROPOSTA,
        referenciaITEMWEBPROPOSTA: item.codigoITEMPROPOSTA,
        propostaITEMWEBPROPOSTA: novaProposta.codigoWEBPROPOSTA,
        produtoITEMWEBPROPOSTA: item.produtoITEMPROPOSTA,
        quantidadeITEMWEBPROPOSTA: item.quantidadeITEMPROPOSTA,
        ordemITEMWEBPROPOSTA: item.embalagempadraoITEMPROPOSTA,
      });
    }

    console.log("Itens da proposta inseridos com sucesso.");

    return res
      .status(201)
      .json({ mensagem: "Proposta sincronizada com sucesso." });

*/
