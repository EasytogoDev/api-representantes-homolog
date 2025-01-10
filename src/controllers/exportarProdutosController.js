const forge = require("node-forge");
const fs = require("fs/promises");
const axios = require("axios");
const https = require("https");
const { Produtos, CF, ErrosSiscomex } = require("../models");
const { sqlServerKnex } = require("../config/sqlserver");

// Caminhos dos certificados e senha
const certPath = "./Certificados/sergio.pfx";
const passphrase = "Sergio99615797"; // Substitua pela senha do certificado

// URL do ambiente
const baseURL = "https://val.portalunico.siscomex.gov.br"; // Alterar para o ambiente de produção, se necessário

// Função para extrair certificado usando node-forge
async function extrairCertificado(certPath, senha) {
  try {
    const certificadoBuffer = await fs.readFile(certPath);
    const p12Asn1 = forge.asn1.fromDer(certificadoBuffer.toString("binary"));
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, senha);

    const certBag = p12.getBags({ bagType: forge.pki.oids.certBag })[
      forge.pki.oids.certBag
    ];
    if (!certBag || certBag.length === 0) {
      throw new Error("Certificado não encontrado no arquivo PFX.");
    }

    const certificado = certBag[0].cert;
    const chavePrivadaBag = p12.getBags({
      bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
    })[forge.pki.oids.pkcs8ShroudedKeyBag];
    const chavePrivada = chavePrivadaBag[0].key;

    return { certificado, chavePrivada };
  } catch (error) {
    console.error("Erro ao processar o certificado:", error.message);
    throw new Error(
      "Erro ao processar o certificado. Verifique a senha ou a validade do arquivo."
    );
  }
}

// Função para autenticar e obter os tokens
async function autenticarPUCOMEX() {
  try {
    const { certificado, chavePrivada } = await extrairCertificado(
      certPath,
      passphrase
    );

    const certPem = forge.pki.certificateToPem(certificado);
    const keyPem = forge.pki.privateKeyToPem(chavePrivada);

    // Endpoint de autenticação
    const url = `${baseURL}/portal/api/autenticar`;

    // Configuração de headers
    const headers = {
      "Role-Type": "IMPEXP", // Substitua pelo perfil necessário
      "Content-Type": "application/json",
    };

    console.log("Iniciando autenticação com o host:", baseURL);

    const httpsAgent = new https.Agent({
      cert: certPem,
      key: keyPem,
      rejectUnauthorized: true, // Verifica o certificado do servidor
    });

    const response = await axios.post(url, {}, { headers, httpsAgent });

    // Extrair tokens do cabeçalho da resposta
    const authorization = response.headers["set-token"];
    const csrfToken = response.headers["x-csrf-token"];

    console.log("Autenticação realizada com sucesso!");
    console.log("Authorization Token:", authorization);
    console.log("X-CSRF-Token:", csrfToken);

    return { authorization, csrfToken };
  } catch (error) {
    console.error("Erro durante a autenticação:", error.message);
    throw error;
  }
}

// Função para enviar os produtos com iteração automática sobre os offsets
exports.enviarProduto = async (req, res) => {
  try {
    const { authorization, csrfToken } = await autenticarPUCOMEX();

    const query = `
        SELECT 
          0 AS seq,
          prop135PRODUTO AS codigoSiscomex, 
          nomePRODUTO AS descricao, 
          partnumberPRODUTO AS denominacao, 
          '61033155' AS cpfCnpjRaiz,
          CASE WHEN descontinuadoPRODUTO = 1 THEN 'INATIVADO' ELSE 'ATIVADO' END AS situacao,
          'IMPORTACAO' AS modalidade,
          nomeCF AS ncm,
          prop136PRODUTO AS versao,
          codigoPRODUTO AS codigosInterno,
          datacriacaoPRODUTO AS dataReferencia,
          codigoEMPRESA, 
          razaoEMPRESA
        FROM tb0319_Similaridade 
        INNER JOIN tb0301_Empresas ON codigoEMPRESA = similarSIMILARIDADE 
        INNER JOIN tb0001_Pastas ON pastaEMPRESA = codigoPASTA 
        INNER JOIN tb0320_Tipos_Similar ON codigoTIPOSIMILAR = tipoSIMILARIDADE 
        INNER JOIN tb0302_Enderecos ON codigoEMPRESA = empresaENDERECO AND estadoENDERECO = 'Ex' AND padraoENDERECO = 1 AND tipoENDERECO = 4
        INNER JOIN tb0310_Produtos_Fornecedor ON codigoEMPRESA = empresaPRODUTOFORNECEDOR AND padraoPRODUTOFORNECEDOR = 1
        INNER JOIN tb0501_Produtos ON codigoPRODUTO = produtoPRODUTOFORNECEDOR
        INNER JOIN tb0507_CF ON codigoCF = cfPRODUTO
        WHERE empresaSIMILARIDADE = 1 
        ORDER BY tipoSIMILARIDADE DESC, razaoEMPRESA;
      `;
    const produtos = await sqlServerKnex.raw(query);

    const url = `${baseURL}/catp/api/ext/produto`;
    const headers = {
      Authorization: authorization,
      "X-CSRF-Token": csrfToken,
      "Content-Type": "application/json",
    };

    console.log("Iniciando envio de produtos em lotes...");

    const { certificado, chavePrivada } = await extrairCertificado(
      certPath,
      passphrase
    );
    const certPem = forge.pki.certificateToPem(certificado);
    const keyPem = forge.pki.privateKeyToPem(chavePrivada);

    const httpsAgent = new https.Agent({
      cert: certPem,
      key: keyPem,
      rejectUnauthorized: true,
    });

    const loteSize = 50; // Tamanho do lote
    let totalSucesso = [];
    let totalErros = [];

    for (let i = 0; i < produtos.length; i += loteSize) {
      const loteProdutos = produtos.slice(i, i + loteSize);

      let seq = 0;
      const logs = loteProdutos.map((produto) => ({
        seq: seq++,
        descricao: produto.descricao,
        denominacao: produto.denominacao,
        cpfCnpjRaiz: produto.cpfCnpjRaiz,
        situacao: produto.situacao,
        modalidade: "IMPORTACAO" || produto.modalidade,
        ncm: produto.ncm.replace(/\./g, ""),
        versao: produto.versao,
        codigosInterno: [produto.codigosInterno.toString()],
        dataReferencia: produto.dataReferencia,
      }));

      console.log(
        `Enviando lote de produtos [${i + 1} a ${i + loteProdutos.length}]...`
      );

      try {
        const response = await axios.post(url, logs, { headers, httpsAgent });

        // Filtra os itens com erro e sucesso
        const itensComErro = response.data.filter(
          (item) =>
            item.erros &&
            item.erros.includes("O valor informado no campo Código é inválido.")
        );

        const itensComSucesso = response.data.filter(
          (item) => !item.erros || item.erros.length === 0
        );

        totalSucesso = totalSucesso.concat(itensComSucesso);

        // Salva itens com erro no banco de dados
        for (const erro of itensComErro) {
          const produtoEnviado = logs.find((p) => p.seq === erro.seq);
          if (produtoEnviado) {
            await ErrosSiscomex.create({
              descricao: produtoEnviado.descricao,
              denominacao: produtoEnviado.denominacao,
              codigoInterno: produtoEnviado.codigosInterno[0],
              erro: erro.erros.join(", "),
            });
          }
        }

        totalErros = totalErros.concat(itensComErro);

        console.log(
          `Lote enviado com sucesso. Sucessos: ${itensComSucesso.length}, Erros: ${itensComErro.length}`
        );
      } catch (error) {
        console.error(
          `Erro ao enviar lote [${i + 1} a ${i + loteProdutos.length}]:`,
          error
        );
      }
    }

    return res.status(200).send({
      mensagem: "Processamento concluído.",
      totalSucesso,
      totalErros,
    });
  } catch (error) {
    console.error("Erro ao enviar produtos:", error);
    return res.status(500).send({
      message: "Erro ao processar a requisição.",
      details: error,
    });
  }
};

exports.cadastrarEmpresa = async (req, res) => {
  try {
    const { authorization, csrfToken } = await autenticarPUCOMEX();

    console.log("authorization:", authorization);
    console.log("csrfToken:", csrfToken);

    const limit = 50;
    let offset = 13000;
    let totalErros = [];
    let totalSucesso = [];

    const query = `
      SELECT 
          ROW_NUMBER() OVER (ORDER BY razaoEMPRESA) AS seq,
          '61033155' AS cpfCnpjRaiz, 
          codigoEMPRESA AS codigo, 
          razaoEMPRESA, 
          logradourofullENDERECO, 
          nomePAIS,
          nomeCIDADE,
          estadoCIDADE
      FROM tb0301_Empresas
      INNER JOIN tb0302_Enderecos ON empresaENDERECO = codigoEMPRESA
      INNER JOIN tb0701_Paises ON codigoPAIS = paisENDERECO
      INNER JOIN tb0703_Cidades ON codigoCIDADE = cidadeENDERECO
      WHERE codigoEMPRESA IN (16544, 41248, 41159, 35618, 17126, 16612, 8224, 40350, 39279, 39280, 14617, 19857, 41038, 41220, 16966, 19856, 16712, 41140, 41219)
      GROUP BY 
	        codigoEMPRESA,
          razaoEMPRESA, 
          logradourofullENDERECO, 
          nomePAIS,
          nomeCIDADE,
          estadoCIDADE;
    `;
    const result = await sqlServerKnex.raw(query);

    const empresas = [];

    const countryCodes = {
      China: "CN",
      Alemanha: "DE",
      Índia: "IN",
    };

    const enviarEmpresas = result.map((empresa) => ({
      seq: empresa.seq,
      cpfCnpjRaiz: empresa.cpfCnpjRaiz,
      codigoInterno: empresa.codigo,
      nome: empresa.razaoEMPRESA,
      logradouro: empresa.logradourofullENDERECO,
      nomeCidade: empresa.nomeCIDADE,
      codigoPais: countryCodes[empresa.nomePAIS] || "OUTRO",
    }));

    // return res.send(enviarEmpresas)

    const url = `${baseURL}/catp/api/ext/operador-estrangeiro`;
    const headers = {
      Authorization: authorization,
      "X-CSRF-Token": csrfToken,
      "Content-Type": "application/json",
    };

    const { certificado, chavePrivada } = await extrairCertificado(
      certPath,
      passphrase
    );
    const certPem = forge.pki.certificateToPem(certificado);
    const keyPem = forge.pki.privateKeyToPem(chavePrivada);

    const httpsAgent = new https.Agent({
      cert: certPem,
      key: keyPem,
      rejectUnauthorized: true,
    });

    const response = await axios.post(url, enviarEmpresas, {
      headers,
      httpsAgent,
    });

    return res.status(200).send({
      mensagem: "Processamento concluído.",
      resposta: response.data,
    });
  } catch (error) {
    console.error("Erro ao enviar produtos:", error.message);
    return res.status(500).send({
      message: "Erro ao processar a requisição.",
      details: error.message,
    });
  }
};

exports.vincularFabricanteComProduto = async (req, res) => {
  try {
    // Autenticação e extração de certificado
    const { authorization, csrfToken } = await autenticarPUCOMEX();
    const { certificado, chavePrivada } = await extrairCertificado(
      certPath,
      passphrase
    );
    const certPem = forge.pki.certificateToPem(certificado);
    const keyPem = forge.pki.privateKeyToPem(chavePrivada);

    const httpsAgent = new https.Agent({
      cert: certPem,
      key: keyPem,
      rejectUnauthorized: true,
    });

    // Passo 1: Executar a consulta SQL
    const query = `
      SELECT 
        0 AS seq,
        nomePRODUTO AS descricao, 
        partnumberPRODUTO AS denominacao, 
        '61033155' AS cpfCnpjRaiz,
        CASE WHEN descontinuadoPRODUTO = 1 THEN 'INATIVADO' ELSE 'ATIVADO' END AS situacao,
        'IMPORTACAO' AS modalidade,
        nomeCF AS ncm,
        codigoPRODUTO AS codigoInterno,
        datacriacaoPRODUTO AS dataReferencia,
        codigoEMPRESA, 
        razaoEMPRESA
      FROM tb0319_Similaridade 
      INNER JOIN tb0301_Empresas ON codigoEMPRESA = similarSIMILARIDADE 
      INNER JOIN tb0001_Pastas ON pastaEMPRESA = codigoPASTA 
      INNER JOIN tb0320_Tipos_Similar ON codigoTIPOSIMILAR = tipoSIMILARIDADE 
      INNER JOIN tb0302_Enderecos ON codigoEMPRESA = empresaENDERECO AND estadoENDERECO = 'Ex' AND padraoENDERECO = 1 AND tipoENDERECO = 4
      INNER JOIN tb0310_Produtos_Fornecedor ON codigoEMPRESA = empresaPRODUTOFORNECEDOR AND padraoPRODUTOFORNECEDOR = 1
      INNER JOIN tb0501_Produtos ON codigoPRODUTO = produtoPRODUTOFORNECEDOR
      INNER JOIN tb0507_CF ON codigoCF = cfPRODUTO
      WHERE empresaSIMILARIDADE = 1 AND codigoEMPRESA = 16544
      ORDER BY tipoSIMILARIDADE DESC, razaoEMPRESA
      `;
    const produtosResult = await sqlServerKnex.raw(query, []);
    const produtos = produtosResult.recordset || produtosResult; // Ajuste conforme necessário

    if (!produtos || produtos.length === 0) {
      return res
        .status(404)
        .send({ message: "Nenhum produto encontrado na consulta SQL." });
    }

    // Passo 2: Extrair codigoPRODUTO
    const filtrados = produtos.map((f) => f.codigoInterno.toString());
    // return res.send(filtrados);

    console.log("BUSCANDO...");
    const resultado = [];
    const erros = [];

    for (const filtrado of filtrados) {
      try {
        const url = `${baseURL}/catp/api/ext/produto?cpfCnpjRaiz=61033155&codigoInterno=${filtrado}`;
        const headers = {
          Authorization: authorization,
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        };

        // Realiza a requisição
        const response = await axios.get(url, { headers, httpsAgent });
        var dataBuscaProdutos = response.data;

        resultado.push(...dataBuscaProdutos);

        // Log cada código interno encontrado
        dataBuscaProdutos.forEach((p) => {
          console.log("Busca finalizada: ", p.codigo);
        });
      } catch (error) {
        erros.push(...filtrado);
        console.error(
          `Erro ao buscar dados para o código interno, mesmo assim gravando: ${filtrado} === `,
          error.message
        );
      }
    }

    // Cria um array com todos os códigos internos
    const codigoInternos = resultado.map((p) => p.codigo);
    const errosInternos = erros.map((p) => p.codigo);

    const body = {
      seq: 1,
      cpfCnpjRaiz: "61033155",
      codigoOperadorEstrangeiro: "",
      conhecido: "",
      codigoProduto: "",
      vincular: "",
      codigoPais: "",
    };

    // Retorna o resultado
    return res.send({
      length: codigoInternos.length,
      codigoInternos,
      errosInternos,
    });
  } catch (error) {
    console.error("Erro ao vincular fabricante com produto:", error);
    return res
      .status(500)
      .send({ message: "Erro interno do servidor.", error });
  }
};
