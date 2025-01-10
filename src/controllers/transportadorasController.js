// const { Carteira, Empresa, Vendedores } = require("../models");
// const jwt = require("jsonwebtoken");
// const { Op } = require("sequelize");
const { sqlServerKnex } = require("../config/sqlserver");

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

    return res.status(500).send(error);
  }
};

// Função que realiza a consulta de transportadoras por cliente
exports.obterTransportadorasPorEmpresa = async (codigo) => {
  const query = `
    SELECT 
        e.codigoEMPRESA AS codigo,
        e.nomeEMPRESA AS FANTASIA,
        e.razaoEMPRESA AS RAZAO,
        e.cnpjEMPRESA AS CNPJ,
        e.pastaEMPRESA AS PASTA,
        e.datacriacaoEMPRESA AS DATA,
        ROW_NUMBER() OVER (ORDER BY e.codigoEMPRESA) AS RowNum
    FROM tb0301_Empresas e
    INNER JOIN tb0312_Transportadores t ON e.codigoEMPRESA = t.transportadorTRANSPORTADOR
    WHERE lixeiraEMPRESA = 0 AND t.empresaTRANSPORTADOR = ?
    GROUP BY e.codigoEMPRESA, e.nomeEMPRESA, e.razaoEMPRESA, e.cnpjEMPRESA, e.pastaEMPRESA, e.datacriacaoEMPRESA
  `;
  try {
    const result = await sqlServerKnex.raw(query, [codigo]);
    return result;
  } catch (error) {
    throw new Error("Erro ao obter transportadoras: " + error.message);
  }
};

exports.getTransportadorasPorCliente = async (req, res) => {
  const { codigo } = req.params;

  try {
    const result = await this.obterTransportadorasPorEmpresa(codigo);
    if (!result) {
      return res.status(404).send({
        message:
          "Não foi possível encontrar uma transportadora para esse cliente!",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.getTransportadorasPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
          e.codigoEMPRESA AS codigo,
          e.nomeEMPRESA AS FANTASIA,
          e.razaoEMPRESA AS RAZAO,
          e.cnpjEMPRESA AS CNPJ,
          e.pastaEMPRESA AS PASTA,
          e.datacriacaoEMPRESA AS DATA,
          ROW_NUMBER() OVER (ORDER BY e.codigoEMPRESA) AS RowNum
      FROM tb0301_Empresas e
      INNER JOIN tb0312_Transportadores t ON e.codigoEMPRESA = t.transportadorTRANSPORTADOR
      WHERE lixeiraEMPRESA = 0 AND t.codigoTRANSPORTADOR = ?
      GROUP BY e.codigoEMPRESA, e.nomeEMPRESA, e.razaoEMPRESA, e.cnpjEMPRESA, e.pastaEMPRESA, e.datacriacaoEMPRESA
  `;
    const result = await sqlServerKnex.raw(query, [id]);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};
