const express = require("express");
const router = express.Router();
const propostasControllers = require("../controllers/propostasControllers");
const login = require("../middleware/login"); // Presumindo que você tenha um middleware de autenticação

/**
 * @swagger
 * tags:
 *   name: Propostas Sistema
 *   description: API para gerenciamento de propostas do sistema
 */

/**
 * @swagger
 * /api/propostas/proposta:
 *   get:
 *     summary: Buscar todas as propostas
 *     tags: [Propostas Sistema]
 *     parameters:
 *       - in: query
 *         name: wms
 *         schema:
 *           type: string
 *         description: Filtrar propostas pelo código WMS.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de propostas a serem retornadas.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Quantidade de propostas a pular antes de começar a retornar resultados.
 *     responses:
 *       200:
 *         description: Lista de propostas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 propostas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       numeroPROPOSTA:
 *                         type: integer
 *                         example: 12345
 *                       razaoEMPRESA:
 *                         type: string
 *                         example: "Empresa X"
 *                       datacriacaoPROPOSTA:
 *                         type: string
 *                         format: date
 *                         example: "2024-11-01"
 *                       statusPROPOSTA:
 *                         type: string
 *                         example: "Em andamento"
 *                       liquidoPROPOSTA:
 *                         type: number
 *                         example: 5000.00
 *                       ipiPROPOSTA:
 *                         type: number
 *                         example: 500.00
 *                       brutoPROPOSTA:
 *                         type: number
 *                         example: 6000.00
 *       500:
 *         description: Erro ao buscar propostas
 */
router.get("/proposta/", login.required, propostasControllers.findAll);

/**
 * @swagger
 * /api/propostas/proposta/{id}:
 *   get:
 *     summary: Buscar uma proposta por ID
 *     tags: [Propostas Sistema]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da proposta
 *     responses:
 *       200:
 *         description: Proposta encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 proposta:
 *                   type: object
 *       404:
 *         description: Proposta não encontrada
 *       500:
 *         description: Erro ao buscar proposta
 */
router.get("/proposta/:id", login.required, propostasControllers.findOne);

/**
 * @swagger
 * /api/propostas/proposta/{id}:
 *   put:
 *     summary: Atualizar uma proposta por ID
 *     tags: [Propostas Sistema]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da proposta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: Descrição da proposta
 *               valor:
 *                 type: number
 *                 description: Valor total da proposta
 *             example:
 *               descricao: "Proposta de TI atualizada"
 *               valor: 5500.00
 *     responses:
 *       200:
 *         description: Proposta atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Proposta atualizada com sucesso!"
 *                 proposta:
 *                   type: object
 *       404:
 *         description: Proposta não encontrada
 *       500:
 *         description: Erro ao atualizar proposta
 */
router.patch("/proposta/:id", login.required, propostasControllers.update);

/**
 * @swagger
 * /api/propostas/proposta/{id}:
 *   delete:
 *     summary: Deletar uma proposta por ID
 *     tags: [Propostas Sistema]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da proposta
 *     responses:
 *       200:
 *         description: Proposta deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Proposta deletada com sucesso!"
 *       404:
 *         description: Proposta não encontrada
 *       500:
 *         description: Erro ao deletar proposta
 */
router.delete("/proposta/:id", login.required, propostasControllers.delete);

/**
 * @swagger
 * /api/propostas/grouped:
 *   get:
 *     summary: Retorna as propostas agrupadas com valores agregados
 *     tags: [Propostas Sistema]
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
 *         description: Quantidade de registros a pular antes de começar a retornar resultados.
 *     responses:
 *       200:
 *         description: Sucesso na busca das propostas agrupadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: integer
 *                     example: 123
 *                   nome:
 *                     type: string
 *                     example: "Proposta X"
 *                   valor_total:
 *                     type: number
 *                     example: 1500.00
 *                   data_criacao:
 *                     type: string
 *                     format: date
 *                     example: "2024-11-01"
 *       500:
 *         description: Erro ao buscar propostas agrupadas
 */
router.get(
  "/grouped",
  login.required,
  propostasControllers.getPropostasGrouped
);

/**
 * @swagger
 * /api/propostas/criar/{codigo}:
 *   post:
 *     summary: Sincronizar proposta do MySQL para o SQL Server
 *     description: Busca uma proposta no banco MySQL e grava no banco SQL Server, incluindo os itens relacionados. Também executa uma procedure após a inserção.
 *     tags: [Propostas Sistema]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código da proposta a ser sincronizada
 *     responses:
 *       201:
 *         description: Proposta sincronizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "1"
 *                 mensagem:
 *                   type: string
 *                   example: "Proposta inserida com sucesso"
 *                 Itens:
 *                   type: integer
 *                   example: 5
 *       404:
 *         description: Proposta não encontrada no MySQL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Proposta não encontrada no MySQL."
 *       500:
 *         description: Erro ao buscar ou sincronizar proposta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar ou sincronizar proposta."
 */
router.post(
  "/criar/:codigo",
  login.required,
  propostasControllers.criarPropostaSistema
);

module.exports = router;
