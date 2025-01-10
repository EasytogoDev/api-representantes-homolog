const express = require("express");
const router = express.Router();
const itensPropostaController = require("../controllers/itensPropostasController");
const login = require("../middleware/login"); // Presumindo que você tenha um middleware de autenticação

/**
 * @swagger
 * tags:
 *   name: Itens da Proposta
 *   description: API para gerenciamento de itens de proposta
 */
 
/**
 * @swagger
 * /api/itens-propostas/{codigo}:
 *   get:
 *     summary: Buscar todos os itens de proposta
 *     tags: [Itens da Proposta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         schema:
 *           type: integer
 *           required: true
 *         description: codigo da proposta a ser buscada.
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
 *         description: Quantidade de registros a serem ignorados antes de retornar resultados.
 *     responses:
 *       200:
 *         description: Lista de itens de proposta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 itensProposta:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       propostaITEMPROPOSTA:
 *                         type: integer
 *                         example: 1001
 *                       produtoITEMPROPOSTA:
 *                         type: integer
 *                         example: 501
 *                       quantidadeITEMPROPOSTA:
 *                         type: number
 *                         example: 10
 *                       valorITEMPROPOSTA:
 *                         type: number
 *                         example: 150.00
 *       500:
 *         description: Erro ao buscar itens de proposta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar itens de proposta"
 */
 
/* 
router.post("/", login.required, itensPropostaController.criarItemProposta);
router.get("/", login.required, itensPropostaController.buscarPropostas);
router.get("/:id", login.required, itensPropostaController.buscarPorId);
router.put("/:id", login.required, itensPropostaController.update);
router.delete("/:id", login.required, itensPropostaController.delete); */
router.get("/:codigo", login.required, itensPropostaController.procuraItensDaProposta);

module.exports = router;
