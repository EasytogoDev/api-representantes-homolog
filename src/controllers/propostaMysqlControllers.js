const {
  PropostaMysql,
  Vendedores,
  ItensPropostaMYSQL,
  Empresa,
  Endereco,
  Cidade,
  Email,
  Telefone,
  TipoEmail,
  TipoTelefone
} = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const axios = require("axios");

async function userIsSeller(req) {
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
}

async function userUsuario(req) {
  const token = req.headers["authorization"];
  const newToken = token.replace("Bearer ", "");
  const decoded = jwt.decode(newToken);
  const usuario = decoded.codigo;

  return usuario;
}

module.exports = {
  // Buscar todas as propostas
  async getAll(req, res) {
    try {
      const usuario = await userIsSeller(req);
      const codvendedor = await userUsuario(req);

      const propostas = await PropostaMysql.findAll({
        where: {
          vendedorPROPOSTA: usuario.codigoVENDEDOR,
          ativoPROPOSTA: 1,
          lixeiraPROPOSTA: 0,
          envioPROPOSTA: 0,
        },
      });

      res.status(200).json(propostas);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar propostas: " + error.message });
    }
  },

  // Buscar uma proposta por ID
  async getById(req, res) {
    try {
      const { codigo } = req.params;
      const proposta = await PropostaMysql.findByPk(codigo);
      if (!proposta) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }
      res.status(200).json(proposta);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar proposta: " + error.message });
    }
  },

  async create(req, res) {
    try {
      // Recupera vendedor e usuário a partir do token
      const codVendedor = await userIsSeller(req); // vendedor
      const codUsuario = await userUsuario(req); // usuário

      // Substitui os valores no corpo da requisição
      //req.body.vendedorPROPOSTA = codVendedor;
      const dadosProposta = {
        ...req.body, // Inclui todos os campos de req.body
        usuarioPROPOSTA: codUsuario, // Sobrescreve ou adiciona usuarioPROPOSTA
        envioPROPOSTA: 0, // Adiciona envioPROPOSTA
        lixeiraPROPOSTA: 0, // Adiciona lixeiraPROPOSTA
        ativoPROPOSTA: 1, // Adiciona lixeiraPROPOSTA
      };

      // Cria a nova proposta no banco de dados
      const novaProposta = await PropostaMysql.create(dadosProposta);

      console.log("Nova proposta criada:", novaProposta);
      res.status(201).json(novaProposta);
    } catch (error) {
      console.error("Erro ao criar proposta:", error);
      res
        .status(500)
        .json({ error: "Erro ao criar proposta: " + error.message });
    }
  },

  // Atualizar uma proposta por ID
  async update(req, res) {
    try {
      const { codigo } = req.params;
      const proposta = await PropostaMysql.findByPk(codigo);
      if (!proposta) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }
      await proposta.update(req.body);
      res.status(200).json(proposta);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar proposta: " + error.message });
    }
  },

  // Deletar uma proposta por ID
  async delete(req, res) {
    try {
      const { codigo } = req.params;
      const proposta = await PropostaMysql.findByPk(codigo);
      if (!proposta) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }
      await proposta.destroy();
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao deletar proposta: " + error.message });
    }
  },

  async renderProposal(req, res) {
    try {
      const { codigo } = req.params;

      // Busca a proposta
      const proposta = await PropostaMysql.findOne({
        where: { codigoPROPOSTA: codigo },
        attributes: [
          "codigoPROPOSTA",
          "dataPROPOSTA",
          "clientePROPOSTA",
          "nomePROPOSTA",
          "observacaoPROPOSTA",
          [
            PropostaMysql.sequelize.fn(
              "DATE_FORMAT",
              PropostaMysql.sequelize.col("dataPROPOSTA"),
              "%d/%m/%Y"
            ),
            "DATA",
          ],
          [
            PropostaMysql.sequelize.fn(
              "DATE_FORMAT",
              PropostaMysql.sequelize.col("dataPROPOSTA"),
              "%H:%i:%s"
            ),
            "HORA",
          ],
        ],
      });

      if (!proposta) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }

      // Busca os itens agregados
      const dados = await ItensPropostaMYSQL.findOne({
        where: { propostaITEMPROPOSTA: proposta.codigoPROPOSTA },
        attributes: [
          [
            ItensPropostaMYSQL.sequelize.fn(
              "COUNT",
              ItensPropostaMYSQL.sequelize.col("codigoITEMPROPOSTA")
            ),
            "CONTAGEM",
          ],
          [
            ItensPropostaMYSQL.sequelize.fn(
              "SUM",
              ItensPropostaMYSQL.sequelize.col("valorxquantidadeITEMPROPOSTA")
            ),
            "ITENS",
          ],
          [
            ItensPropostaMYSQL.sequelize.fn(
              "SUM",
              ItensPropostaMYSQL.sequelize.col("valoripiITEMPROPOSTA")
            ),
            "IPI",
          ],
          [
            ItensPropostaMYSQL.sequelize.fn(
              "SUM",
              ItensPropostaMYSQL.sequelize.col("valorstITEMPROPOSTA")
            ),
            "ST",
          ],
          [
            ItensPropostaMYSQL.sequelize.fn(
              "SUM",
              ItensPropostaMYSQL.sequelize.col("valortotalITEMPROPOSTA")
            ),
            "TOTAL",
          ],
        ],
      });

      // Busca os itens individuais
      const itens = await ItensPropostaMYSQL.findAll({
        where: { propostaITEMPROPOSTA: proposta.codigoPROPOSTA },
        attributes: [
          "partnumberITEMPROPOSTA",
          "nomeITEMPROPOSTA",
          "quantidadeITEMPROPOSTA",
          "valorITEMPROPOSTA",
          "valorxquantidadeITEMPROPOSTA",
          "ipiITEMPROPOSTA",
          "valoripiITEMPROPOSTA",
          "valorstITEMPROPOSTA",
          "valortotalITEMPROPOSTA",
        ],
      });

      // Consulta o cliente via API

      const cliente = await Empresa.findOne({
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
        where: { codigoEMPRESA: proposta.clientePROPOSTA },
      });

      // Renderiza o HTML
      let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Pragma" content="no-cache">
          <title>Proposta N° ${String(proposta.codigoPROPOSTA).padStart(
            6,
            "0"
          )} Cliente: ${
        cliente.razaoEMPRESA || proposta.nomePROPOSTA
      } - Karmake Comunicação</title>
          <link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">
          <link href="/assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">
          <link href="/assets/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet">
          <link href="/assets/plugins/icomoon/style.css" rel="stylesheet">
          <link href="/assets/plugins/uniform/css/default.css" rel="stylesheet"/>
          <link href="/assets/plugins/switchery/switchery.min.css" rel="stylesheet"/>
          <link href="/assets/css/space.min.css" rel="stylesheet">
          <link href="/assets/css/custom.css" rel="stylesheet">
        </head>
          <style>
            body {
              font-family: 'Ubuntu', sans-serif;
            }
            table th, table td {
              text-align: left;
              vertical-align: top;
            }
          </style>
        <body class="error-page" onload="self.print();">
          <div class="page-container page-error">
            <div class="page-content">
              <div class="row">
                <div class="col-md-12">
                  <div class="panel panel-white">
                    <div class="panel-body">
                      <div class="row">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <!-- Célula com o logo -->
            <td rowspan="2" valign="middle" style="vertical-align: middle; padding-right: 20px;">
              <img width="100" src="https://rainhadassete.com.br/images/logo-rainha-das-sete.webp" alt="Logo">
            </td>
            <!-- Espaço vazio (se necessário) -->
            <td></td>
          </tr>
          <tr>
            <!-- Célula com o texto -->
            <td>
              <div style="margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 20px;">
                  <b>N° ${String(proposta.codigoPROPOSTA).padStart(
                    6,
                    "0"
                  )} • Rainha das Sete</b>
                </h3>
              </div>
              <div style="font-size: 14px; line-height: 1.5;">
                <address>
                  Avenida Deputado Cantídio Sampaio, 6100 • São Paulo/SP • CEP: 02860-001<br>
                  <strong>CNPJ:</strong> 61.033.155/0001-19 • <strong>IE:</strong> 112.486.303.114<br>
                  <strong>Telefone:</strong> (011) 2856-7300 • <strong>E-Mail:</strong> rainhadassete@rainhadassete.com.br
                </address>
              </div>
            </td>
          </tr>
        </table>

                      </div>
                      <div class="col-md-12" style="padding-left:0;">
                        <hr>
                      </div>
                      <div class="col-md-12" style="padding-left:0;padding-right:0;">
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th align="left">PN</th>
                              <th align="left">Descrição</th>
                              <th align="center">Qtd.</th>
                              <th>UN</th>
                              <th>Líq.</th>
                              <th align="center">IPI</th>
                              <th>IPI</th>
                              <th>ST</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${itens
                              .map(
                                (item) => `
                              <tr>
                                <td align="left">${
                                  item.partnumberITEMPROPOSTA
                                }</td>
                                <td align="left">${item.nomeITEMPROPOSTA}</td>
                                <td align="center">${
                                  item.quantidadeITEMPROPOSTA
                                }</td>
                                <td>R$ ${parseFloat(item.valorITEMPROPOSTA)
                                  .toFixed(2)
                                  .replace(".", ",")}</td>
                                <td>R$ ${parseFloat(
                                  item.valorxquantidadeITEMPROPOSTA
                                )
                                  .toFixed(2)
                                  .replace(".", ",")}</td>
                                <td>${parseFloat(item.ipiITEMPROPOSTA)
                                  .toFixed(0)
                                  .replace(".", ",")}%</td>
                                <td>R$ ${parseFloat(item.valoripiITEMPROPOSTA)
                                  .toFixed(2)
                                  .replace(".", ",")}</td>
                                <td>R$ ${parseFloat(item.valorstITEMPROPOSTA)
                                  .toFixed(2)
                                  .replace(".", ",")}</td>
                                <td>R$ ${parseFloat(item.valortotalITEMPROPOSTA)
                                  .toFixed(2)
                                  .replace(".", ",")}</td>
                              </tr>`
                              )
                              .join("")}
                          </tbody>
                        </table>
                        <hr>
                      </div>
                      <table style="width:100%">
                        <tr>
                          <td valign="top">
                            <div class="col-md-12" style="padding-left:0;">
                              <p>
                                <strong>Proposta para</strong><br>
                                ${proposta.nomePROPOSTA} (${
        cliente.razaoEMPRESA || "N/A"
      })<br>
                                ${
                                  proposta.observacaoPROPOSTA
                                    ? `<strong>Observação</strong><br>${proposta.observacaoPROPOSTA}<br>`
                                    : ""
                                }

                              </p>

                              <address>
                                  ${cliente.enderecos[0].logradouroENDERECO || ""}, ${
        cliente.enderecos[0].numeroENDERECO || ""
      }<br>
                                  ${cliente.enderecos[0].cidade.nomeCIDADE || ""}, ${
        cliente.enderecos[0].estadoENDERECO || ""
      }<br>
                                  <strong>CNPJ:</strong> ${
                                    cliente.cnpjEMPRESA || ""
                                  }<br>
                                  <strong>Telefone:</strong> ${
                                    cliente.telefone.numeroTELEFONE || ""
                                  }<br>
                                  <strong>E-Mail:</strong> ${
                                    cliente.emails.enderecoEMAIL || ""
                                  }
                              </address>

                            </div>
                          </td>
                          <td>
                            <div class="col-md-12" style="padding-right:0;">
                              <div class="text-right">
                                <h4 class="no-m m-t-sm">Subtotal</h4>
                                <h2 class="no-m">R$ ${parseFloat(
                                  dados.dataValues.ITENS
                                )
                                  .toFixed(2)
                                  .replace(".", ",")}</h2>
                                <hr>
                                <h4 class="no-m m-t-sm">Impostos</h4>
                                <h2 class="no-m">R$ ${parseFloat(
                                  dados.dataValues.IPI + dados.dataValues.ST
                                )
                                  .toFixed(2)
                                  .replace(".", ",")}</h2>
                                <hr>
                                <h4 class="no-m m-t-md text-success">Total</h4>
                                <h1 class="no-m text-success">R$ ${parseFloat(
                                  dados.dataValues.TOTAL
                                )
                                  .toFixed(2)
                                  .replace(".", ",")}</h1>
                                <hr>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
`;

      res.send(html);
    } catch (error) {
      console.error("Erro ao renderizar proposta:", error);
      res.status(500).send({ error });
    }
  },
};
