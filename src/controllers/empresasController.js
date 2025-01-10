const {
  Endereco,
  Cidade,
  Email,
  Carteira,
  Empresa,
  Telefone,
  TipoTelefone,
  TipoEmail,
  Vendedores,
} = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { sqlServerKnex } = require("../config/sqlserver");

exports.userIsSeller = async (req) => {
  const token = req.headers["authorization"];
  const newToken = token.replace("Bearer ", "");
  const decoded = jwt.decode(newToken);
  const usuario = decoded.codigo;

  const codigoVendedor = await Vendedores.findOne({
    where: {
      usuarioassociadoVENDEDOR: usuario,
    },
  });

  return codigoVendedor;
};

exports.getAll = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const usuario = await this.userIsSeller(req);

    const empresas = await Empresa.findAll({
      attributes: [
        "codigoEMPRESA",
        "nomeEMPRESA",
        "razaoEMPRESA",
        "cnpjEMPRESA",
      ],
      include: [
        {
          model: Carteira,
          as: "carteiras",
          attributes: [],
          ...(usuario !== null
            ? { where: { vendedorCARTEIRA: usuario.codigoVENDEDOR } }
            : ""),
        },
        {
          model: Endereco,
          as: "enderecos",
          attributes: [
            "logradouroENDERECO",
            "numeroENDERECO",
            "cepENDERECO",
            "bairroENDERECO",
            "estadoENDERECO",
            "paisENDERECO",
            "padraoENDERECO",
            "tipoENDERECO",
          ],
          where: {
            padraoENDERECO: 1,
            tipoENDERECO: 4,
          },
          include: [
            { model: Cidade, as: "cidade", attributes: ["nomeCIDADE"] },
          ],
        },
        {
          model: Telefone,
          as: "telefone",
          attributes: ["numeroTELEFONE"],
          include: [
            {
              model: TipoTelefone,
              as: "tipo_telefone",
              attributes: ["abreviaturaTIPOTELEFONE"],
            },
          ],
        },
        {
          model: Email,
          as: "emails",
          attributes: ["enderecoEMAIL"],
          include: [
            {
              model: TipoEmail,
              as: "tipo_email",
              attributes: ["descricaoTIPOEMAIL"],
            },
          ],
        },
      ],
      where: {
        lixeiraEMPRESA: 0,
        pastaEMPRESA: {
          [Op.in]: [
            17, 94, 132, 150, 178, 3130, 4469, 166, 167, 168, 169, 170, 171,
            172, 173, 205,
          ],
        },
      },
      limit,
      offset,
    });

    const empresasFormatadas = empresas.map((empresa) => {
      const enderecosFormatados = empresa.enderecos.map((endereco) => ({
        logradouroENDERECO: endereco.logradouroENDERECO,
        numeroENDERECO: endereco.numeroENDERECO,
        cepENDERECO: endereco.cepENDERECO,
        bairroENDERECO: endereco.bairroENDERECO,
        estadoENDERECO: endereco.estadoENDERECO,
        paisENDERECO: endereco.paisENDERECO,
        nomeCIDADE: endereco.cidade ? endereco.cidade.nomeCIDADE : null,
      }));

      const telefonesFormatados = empresa.telefone.map((telefone) => ({
        numeroTELEFONE: telefone.numeroTELEFONE,
        tipo_telefone: telefone.tipo_telefone
          ? telefone.tipo_telefone.abreviaturaTIPOTELEFONE
          : null,
      }));

      const emailsFormatados = empresa.emails.map((email) => ({
        enderecoEMAIL: email.enderecoEMAIL,
        tipo_email: email.tipo_email
          ? email.tipo_email.descricaoTIPOEMAIL
          : null,
      }));

      return {
        codigoEMPRESA: empresa.codigoEMPRESA,
        nomeEMPRESA: empresa.nomeEMPRESA,
        razaoEMPRESA: empresa.razaoEMPRESA,
        cnpjEMPRESA: empresa.cnpjEMPRESA,
        enderecos: enderecosFormatados,
        telefone: telefonesFormatados,
        emails: emailsFormatados,
      };
    });

    return res.status(200).json(empresasFormatadas);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.getByCodigo = async (req, res, next) => {
  const codigoEMPRESA = req.params.codigo; // Código da empresa passado como parâmetro na URL

  try {
    const usuario = await this.userIsSeller(req);

    const empresa = await Empresa.findOne({
      where: {
        codigoEMPRESA,
        lixeiraEMPRESA: 0,
      },
      attributes: [
        "codigoEMPRESA",
        "nomeEMPRESA",
        "razaoEMPRESA",
        "cnpjEMPRESA",
      ],
      include: [
        {
          model: Endereco,
          as: "enderecos",
          attributes: [
            "logradouroENDERECO",
            "numeroENDERECO",
            "cepENDERECO",
            "bairroENDERECO",
            "estadoENDERECO",
            "paisENDERECO",
            "padraoENDERECO",
            "tipoENDERECO",
          ],
          where: {
            padraoENDERECO: 1,
            tipoENDERECO: 4,
          },
          include: [
            { model: Cidade, as: "cidade", attributes: ["nomeCIDADE"] },
          ],
        },
        {
          model: Telefone,
          as: "telefone",
          attributes: ["numeroTELEFONE"],
          include: [
            {
              model: TipoTelefone,
              as: "tipo_telefone",
              attributes: ["abreviaturaTIPOTELEFONE"],
            },
          ],
        },
        {
          model: Email,
          as: "emails",
          attributes: ["enderecoEMAIL"],
          include: [
            {
              model: TipoEmail,
              as: "tipo_email",
              attributes: ["descricaoTIPOEMAIL"],
            },
          ],
        },
      ],
    });

    const listas = `
      SELECT nomeLISTA, padraoEMPRESALISTA FROM tb0316_Listas 
      INNER JOIN tb0508_Listas ON codigoLISTA = listaEMPRESALISTA
      WHERE empresaEMPRESALISTA = ? AND padraoEMPRESALISTA = 1
    `;

    const buscarListas = await sqlServerKnex.raw(listas, [codigoEMPRESA]);

    const cpgto = `
    SELECT nomeCPGTO, padraoEMPRESACPGTO FROM tb0308_CPGTO 
    INNER JOIN tb1605_CPGTO ON codigoCPGTO = cpgtoEMPRESACPGTO
    WHERE empresaEMPRESACPGTO = ? AND padraoEMPRESACPGTO = 1
`;

    const buscarCPGTO = await sqlServerKnex.raw(cpgto, [codigoEMPRESA]);

    if (!empresa) {
      return res.status(404).json({ message: "Empresa não encontrada." });
    }

    const enderecosFormatados = empresa.enderecos.map((endereco) => ({
      logradouroENDERECO: endereco.logradouroENDERECO,
      numeroENDERECO: endereco.numeroENDERECO,
      cepENDERECO: endereco.cepENDERECO,
      bairroENDERECO: endereco.bairroENDERECO,
      estadoENDERECO: endereco.estadoENDERECO,
      paisENDERECO: endereco.paisENDERECO,
      nomeCIDADE: endereco.cidade ? endereco.cidade.nomeCIDADE : null,
    }));

    const telefonesFormatados = empresa.telefone.map((telefone) => ({
      numeroTELEFONE: telefone.numeroTELEFONE,
      tipo_telefone: telefone.tipo_telefone
        ? telefone.tipo_telefone.abreviaturaTIPOTELEFONE
        : null,
    }));

    const emailsFormatados = empresa.emails.map((email) => ({
      enderecoEMAIL: email.enderecoEMAIL,
      tipo_email: email.tipo_email ? email.tipo_email.descricaoTIPOEMAIL : null,
    }));

    const empresaFormatada = {
      codigoEMPRESA: empresa.codigoEMPRESA,
      nomeEMPRESA: empresa.nomeEMPRESA,
      razaoEMPRESA: empresa.razaoEMPRESA,
      cnpjEMPRESA: empresa.cnpjEMPRESA,
      enderecos: enderecosFormatados,
      telefone: telefonesFormatados,
      emails: emailsFormatados,
      cpgto: buscarCPGTO,
      listas: buscarListas,
    };

    return res.status(200).json(empresaFormatada);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.getFornecedores = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  try {
    const query = `
      SELECT * FROM (
        SELECT 
            codigoEMPRESA AS codigo,
            nomeEMPRESA AS FANTASIA,
            razaoEMPRESA AS RAZAO,
            cnpjEMPRESA AS CNPJ,
            pastaEMPRESA AS PASTA,
            datacriacaoEMPRESA AS DATA,
            ROW_NUMBER() OVER (ORDER BY codigoEMPRESA) AS RowNum
        FROM tb0301_Empresas
        INNER JOIN tb0309_Fornecedores ON codigoEMPRESA = empresaFORNECEDOR
        WHERE lixeiraEMPRESA = 0
        GROUP BY codigoEMPRESA, nomeEMPRESA, razaoEMPRESA, cnpjEMPRESA, pastaEMPRESA, datacriacaoEMPRESA
      ) AS Result
      WHERE RowNum > ? AND RowNum <= (? + ?)
      ORDER BY RowNum;
    `;
    const result = await sqlServerKnex.raw(query, [offset, offset, limit]);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar dados dos fornecedores:", error);
    return res.sendStatus(500);
  }
};

exports.getTransportadoras = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const query = `
      SELECT * FROM (
        SELECT 
            codigoEMPRESA AS codigo,
            nomeEMPRESA AS FANTASIA,
            razaoEMPRESA AS RAZAO,
            cnpjEMPRESA AS CNPJ,
            pastaEMPRESA AS PASTA,
            datacriacaoEMPRESA AS DATA,
            ROW_NUMBER() OVER (ORDER BY codigoEMPRESA) AS RowNum
        FROM tb0301_Empresas
        INNER JOIN tb0312_Transportadores ON codigoEMPRESA = transportadorTRANSPORTADOR
        WHERE lixeiraEMPRESA = 0
        GROUP BY codigoEMPRESA, nomeEMPRESA, razaoEMPRESA, cnpjEMPRESA, pastaEMPRESA, datacriacaoEMPRESA
      ) AS Result
      WHERE RowNum > ? AND RowNum <= (? + ?)
      ORDER BY RowNum;
    `;
    const result = await sqlServerKnex.raw(query, [offset, offset, limit]);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar dados das transportadoras:", error);
    return res.sendStatus(500);
  }
};

exports.getClientes = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const isSeller = await this.userIsSeller(req);
  const vendedor = isSeller.codigoVENDEDOR;

  if (isSeller) {
    try {
      const query = `
        SELECT * FROM (
          SELECT 
            e.codigoEMPRESA AS CODIGO,
            e.nomeEMPRESA AS FANTASIA,
            e.razaoEMPRESA AS RAZAO,
            e.cnpjEMPRESA AS CNPJ,
            e.pastaEMPRESA AS PASTA,
            e.datacriacaoEMPRESA AS DATA,
            ROW_NUMBER() OVER (ORDER BY e.codigoEMPRESA) AS RowNum,
            en.estadoENDERECO AS ESTADO,
            cdd.nomeCIDADE AS CIDADE,
            tel.numeroTELEFONE AS TELEFONE,
            ema.enderecoEMAIL AS EMAIL
          FROM tb0301_Empresas e
          INNER JOIN tb1616_Carteiras c 
            ON e.codigoEMPRESA = c.empresaCARTEIRA
          LEFT JOIN tb0302_Enderecos en 
            ON e.codigoEMPRESA = en.empresaENDERECO
          LEFT JOIN tb0703_Cidades cdd 
            ON en.cidadeENDERECO = cdd.codigoCIDADE
          LEFT JOIN tb0303_Telefones tel 
            ON e.codigoEMPRESA = tel.empresaTELEFONE
          LEFT JOIN tb0331_Emails ema
            ON e.codigoEMPRESA = ema.codigoEMAIL
          WHERE e.lixeiraEMPRESA = 0 AND c.vendedorCARTEIRA = ?
          GROUP BY 
            e.codigoEMPRESA, 
            e.nomeEMPRESA, 
            e.razaoEMPRESA, 
            e.cnpjEMPRESA, 
            e.pastaEMPRESA, 
            e.datacriacaoEMPRESA,
            en.estadoENDERECO,
            cdd.nomeCIDADE,
            tel.numeroTELEFONE,
            ema.enderecoEMAIL 
        ) AS Result
        WHERE RowNum > ? AND RowNum <= (? + ?)
        ORDER BY RowNum;
      `;

      const result = await sqlServerKnex.raw(query, [
        vendedor,
        offset,
        offset,
        limit,
      ]);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao buscar dados dos clientes:", error);
      return res.sendStatus(500);
    }
  } else {
    try {
      const query = `
        SELECT * FROM (
          SELECT 
            e.codigoEMPRESA AS codigo,
            e.nomeEMPRESA AS FANTASIA,
            e.razaoEMPRESA AS RAZAO,
            e.cnpjEMPRESA AS CNPJ,
            e.pastaEMPRESA AS PASTA,
            e.datacriacaoEMPRESA AS DATA,
            ROW_NUMBER() OVER (ORDER BY e.codigoEMPRESA) AS RowNum,
            en.estadoENDERECO AS ESTADO,
            cdd.nomeCIDADE AS CIDADE
          FROM tb0301_Empresas e
          INNER JOIN tb1616_Carteiras c 
            ON e.codigoEMPRESA = c.empresaCARTEIRA
          LEFT JOIN tb0302_Enderecos en 
            ON e.codigoEMPRESA = en.empresaENDERECO
          LEFT JOIN tb0703_Cidades cdd 
            ON en.cidadeENDERECO = cdd.codigoCIDADE
          WHERE e.lixeiraEMPRESA = 0
          GROUP BY 
            e.codigoEMPRESA, 
            e.nomeEMPRESA, 
            e.razaoEMPRESA, 
            e.cnpjEMPRESA, 
            e.pastaEMPRESA, 
            e.datacriacaoEMPRESA,
            en.estadoENDERECO,
            cdd.nomeCIDADE
        ) AS Result
        WHERE RowNum > ? AND RowNum <= (? + ?)
        ORDER BY RowNum;
      `;
      const result = await sqlServerKnex.raw(query, [offset, offset, limit]);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao buscar dados dos clientes:", error);
      return res.sendStatus(500);
    }
  }
};

exports.obterClientePeloId = async (id) => {
  try {
    const query = `

          SELECT 
            e.codigoEMPRESA AS codigo,
            e.nomeEMPRESA AS FANTASIA,
            e.razaoEMPRESA AS RAZAO,
            e.cnpjEMPRESA AS CNPJ,
            e.pastaEMPRESA AS PASTA,
            e.datacriacaoEMPRESA AS DATA,
            ROW_NUMBER() OVER (ORDER BY e.codigoEMPRESA) AS RowNum,
            en.estadoENDERECO AS ESTADO,
            cdd.nomeCIDADE AS CIDADE
          FROM tb0301_Empresas e
          INNER JOIN tb1616_Carteiras c 
            ON e.codigoEMPRESA = c.empresaCARTEIRA
          LEFT JOIN tb0302_Enderecos en 
            ON e.codigoEMPRESA = en.empresaENDERECO
          LEFT JOIN tb0703_Cidades cdd 
            ON en.cidadeENDERECO = cdd.codigoCIDADE
          WHERE e.lixeiraEMPRESA = 0
          AND codigoEMPRESA = ?
          GROUP BY 
            e.codigoEMPRESA, 
            e.nomeEMPRESA, 
            e.razaoEMPRESA, 
            e.cnpjEMPRESA, 
            e.pastaEMPRESA, 
            e.datacriacaoEMPRESA,
            en.estadoENDERECO,
            cdd.nomeCIDADE

      `;
    const result = await sqlServerKnex.raw(query, [id]);

    return result;
  } catch (error) {
    return error;
  }
};

exports.getClienteById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await obterClientePeloId(id);

    if (!result) {
      return res.status(404).send({ message: "Erro ao obter cliente" });
    }

    return res.send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};
