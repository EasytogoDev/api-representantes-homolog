const express = require("express");
const router = express.Router();
const fiscalController = require("../controllers/fiscalController");
const login = require("../middleware/login"); // Middleware de autenticação

/**
 * @swagger
 * /api/fiscal/:
 *   get:
 *     summary: Obter dados do pedido e informações fiscais com paginação
 *     description: Retorna os dados de um pedido específico com detalhes fiscais associados, com suporte a paginação.
 *     tags:
 *       - Fiscal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de registros a serem retornados.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de registros a serem pulados antes de iniciar a listagem.
 *     responses:
 *       '200':
 *         description: Dados do pedido e informações fiscais retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   numeroGerenciador:
 *                     type: integer
 *                     description: Número do gerenciador da NFe.
 *                     example: 12345
 *                   statusGERENCIADORNFE:
 *                     type: string
 *                     description: Status do gerenciador da NFe.
 *                     example: "Aprovado"
 *                   SerieNF:
 *                     type: integer
 *                     description: Série da nota fiscal.
 *                     example: 1
 *                   numeroNF:
 *                     type: integer
 *                     description: Número da nota fiscal.
 *                     example: 701
 *                   DataEmissao:
 *                     type: string
 *                     format: date-time
 *                     description: Data de emissão da nota fiscal.
 *                     example: "2016-06-01T00:00:00.000Z"
 *                   DataCriacao:
 *                     type: string
 *                     format: date-time
 *                     description: Data de criação do pedido.
 *                     example: "2016-06-01T00:00:00.000Z"
 *                   CodigoEmitente:
 *                     type: integer
 *                     description: Código do emitente.
 *                     example: 123456
 *                   CnpjEmitente:
 *                     type: string
 *                     description: CNPJ do emitente.
 *                     example: "12345678000195"
 *                   CpfEmitente:
 *                     type: string
 *                     description: CPF do emitente.
 *                     example: "12345678901"
 *                   RazaoSocialEmitente:
 *                     type: string
 *                     description: Razão social do emitente.
 *                     example: "Empresa Emitente Ltda"
 *                   chaveNF:
 *                     type: string
 *                     description: Chave da nota fiscal.
 *                     example: "35160608100049000128550010000007011030014867"
 *                   CodigoDestinatario:
 *                     type: integer
 *                     description: Código do destinatário.
 *                     example: 78910
 *                   CnpjDestinatario:
 *                     type: string
 *                     description: CNPJ do destinatário.
 *                     example: "10987654321098"
 *                   CpfDestinatario:
 *                     type: string
 *                     description: CPF do destinatário.
 *                     example: "10987654321"
 *                   RazaoSocialDest:
 *                     type: string
 *                     description: Razão social do destinatário.
 *                     example: "Empresa Destinatária Ltda"
 *                   valorLiquidoNF:
 *                     type: number
 *                     format: float
 *                     description: Valor líquido da nota fiscal.
 *                     example: 45480.50
 *                   Itens:
 *                     type: array
 *                     description: Lista de itens da nota fiscal.
 *                     items:
 *                       type: object
 *                       properties:
 *                         PartNumber:
 *                           type: string
 *                           description: Código do produto (Part Number).
 *                           example: "53"
 *                         quantidade:
 *                           type: number
 *                           format: float
 *                           description: Quantidade do item.
 *                           example: 20.0
 *                         valorUnitario:
 *                           type: number
 *                           format: float
 *                           description: Valor unitário do item.
 *                           example: 6.5
 *                         Produto:
 *                           type: string
 *                           description: Nome do produto.
 *                           example: "SARRAFO 10CM"
 *                         codigoPedido:
 *                           type: integer
 *                           description: Código do pedido.
 *                           example: 123
 *                         codigoProduto:
 *                           type: integer
 *                           description: Código do produto vinculado.
 *                           example: 456
 *       '400':
 *         description: Parâmetros inválidos fornecidos.
 *       '401':
 *         description: Falha na autenticação (Token inválido ou ausente).
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get("/", login.required, fiscalController.getPedidoData);

module.exports = router;
