const { Temp1601RetornoWms, Temp1602RetornoItensWms } = require("../models");
const sqlServerConfig = require("../config/sqlserver");
const { QueryTypes } = require("sequelize");

exports.webhookVendas = async (req, res) => {
  try {
    const { proposta, statuswms ,usuario, itens } = req.body;

    const createRetornoProposta = await Temp1601RetornoWms.create({
      codigoPROPOSTA: proposta,
      wmsPROPOSTA: statuswms ,
      usuarioPROPOSTA: usuario,
    });

    console.log({ createRetornoProposta });

    if (!createRetornoProposta) {
      return res.status(500).json({ erro: "Erro ao criar a proposta." });
    }

    for (const item of itens) {
      const { codigoItem, produtoItem, quantidadeItem, statusItem } = item;

      const createRetornoItem = await Temp1602RetornoItensWms.create({
        codigoITEMPROPOSTA: codigoItem,
        produtoITEMPROPOSTA: produtoItem,
        propostaITEMPROPOSTA: proposta,
        quantidadeITEMPROPOSTA: quantidadeItem,
        statusITEMPROPOSTA: statusItem,
        locacaoITEMPROPOSTA: "BR",
        loteITEMPROPOSTA: 1,
        nomeloteITEMPROPOSTA: "nome teste",
      });

      console.log(createRetornoItem);

      if (!createRetornoItem) {
        return res
          .status(500)
          .json({ erro: "Erro ao criar os itens da proposta." });
      }
    }

    const execProcedure = await sqlServerConfig.query(
      "EXEC spr1601_Retorno_Wms @PROPOSTA = :proposta, @USUARIO = :usuario",
      {
        replacements: { proposta, usuario },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    console.log("Procedure: ", execProcedure);

    return res.status(201).json({ ok: "OK" });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).json({ "Erro no webhook:": error.message });
  }
};

exports.webhookCompras = async (req, res) => {
  try {
    const { proposta, statuswms ,usuario, itens } = req.body;

    const createRetornoProposta = await Temp1601RetornoWms.create({
      codigoPROPOSTA: proposta,
      wmsPROPOSTA: statuswms ,
      usuarioPROPOSTA: usuario,
    });

    console.log({ createRetornoProposta });

    if (!createRetornoProposta) {
      return res.status(500).json({ erro: "Erro ao criar a proposta." });
    }

    for (const item of itens) {
      const { codigoItem, produtoItem, quantidadeItem, statusItem } = item;

      const createRetornoItem = await Temp1602RetornoItensWms.create({
        codigoITEMPROPOSTA: codigoItem,
        produtoITEMPROPOSTA: produtoItem,
        propostaITEMPROPOSTA: proposta,
        quantidadeITEMPROPOSTA: quantidadeItem,
        statusITEMPROPOSTA: statusItem,
        locacaoITEMPROPOSTA: "BR",
        loteITEMPROPOSTA: 1,
        nomeloteITEMPROPOSTA: "nome teste",
      });

      console.log(createRetornoItem);

      if (!createRetornoItem) {
        return res
          .status(500)
          .json({ erro: "Erro ao criar os itens da proposta." });
      }
    }

    // const execProcedure = await sqlServerConfig.query(
    //   "EXEC spr1601_Retorno_Wms @PROPOSTA = :proposta, @USUARIO = :usuario",
    //   {
    //     replacements: { proposta, usuario },
    //     type: QueryTypes.SELECT,
    //     raw: true,
    //   }
    // );

    const result = {
      "codigo": 0,
      "usuario": 0,
      "wms": 0,
      "itens": [
        {
          "codigo": 0, 
          "produto": 0,
          "quantidade": 0,
          "recebido": 0,
          "divergente": 0,
          "status": 0
        }
      ]
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).json({ "Erro no webhook:": error.message });
  }
};


exports.webhookOP = async (req, res) => {
  try {
    const { proposta, statuswms ,usuario, itens } = req.body;

    const createRetornoProposta = await Temp1601RetornoWms.create({
      codigoPROPOSTA: proposta,
      wmsPROPOSTA: statuswms ,
      usuarioPROPOSTA: usuario,
    });

    console.log({ createRetornoProposta });

    if (!createRetornoProposta) {
      return res.status(500).json({ erro: "Erro ao criar a proposta." });
    }

    for (const item of itens) {
      const { codigoItem, produtoItem, quantidadeItem, statusItem } = item;

      const createRetornoItem = await Temp1602RetornoItensWms.create({
        codigoITEMPROPOSTA: codigoItem,
        produtoITEMPROPOSTA: produtoItem,
        propostaITEMPROPOSTA: proposta,
        quantidadeITEMPROPOSTA: quantidadeItem,
        statusITEMPROPOSTA: statusItem,
        locacaoITEMPROPOSTA: "BR",
        loteITEMPROPOSTA: 1,
        nomeloteITEMPROPOSTA: "nome teste",
      });

      console.log(createRetornoItem);

      if (!createRetornoItem) {
        return res
          .status(500)
          .json({ erro: "Erro ao criar os itens da proposta." });
      }
    }

    // const execProcedure = await sqlServerConfig.query(
    //   "EXEC spr1601_Retorno_Wms @PROPOSTA = :proposta, @USUARIO = :usuario",
    //   {
    //     replacements: { proposta, usuario },
    //     type: QueryTypes.SELECT,
    //     raw: true,
    //   }
    // );

    const result = {
      "codigo": 0,
      "usuario": 0,
      "wms": 0,
      "itens": [
        {
          "codigo": 0, 
          "produto": 0,
          "quantidade": 0,
          "recebido": 0,
          "divergente": 0,
          "status": 0
        }
      ]
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).json({ "Erro no webhook:": error.message });
  }
};

