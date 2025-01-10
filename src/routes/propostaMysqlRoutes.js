const express = require("express");
const router = express.Router();
const propostaMysqlController = require("../controllers/propostaMysqlControllers");
const login = require("../middleware/login"); // Middleware de autenticação

/**
 * @swagger
 * tags:
 *   - name: Propostas Web
 *     description: API para gerenciamento de propostas
 */

/**
 * @swagger
 * /api/propostas-web:
 *   get:
 *     summary: Buscar todas as propostas
 *     tags: [Propostas Web]
 *     responses:
 *       200:
 *         description: Lista de propostas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", login.required, propostaMysqlController.getAll);

/**
 * @swagger
 * /api/propostas-web/{codigo}/render:
 *   get:
 *     summary: Renderizar proposta como HTML
 *     tags: [Propostas Web]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da proposta
 *     responses:
 *       200:
 *         description: Proposta renderizada como HTML
 *       404:
 *         description: Proposta não encontrada
 */
router.get("/:codigo/render", login.required, propostaMysqlController.renderProposal);


/**
 * @swagger
 * /api/propostas-web/{codigo}:
 *   get:
 *     summary: Buscar uma proposta por ID
 *     tags: [Propostas Web]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da proposta
 *     responses:
 *       200:
 *         description: Dados da proposta encontrada
 *       404:
 *         description: Proposta não encontrada
 */
router.get("/:codigo", login.required, propostaMysqlController.getById);

/**
 * @swagger
 * /api/propostas-web:
 *   post:
 *     summary: Criar uma nova proposta
 *     tags: [Propostas Web]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoPROPOSTA:
 *                 type: integer
 *               usuarioPROPOSTA:
 *                 type: integer
 *               vendedorPROPOSTA:
 *                 type: integer
 *               clientePROPOSTA:
 *                 type: integer
 *               nomePROPOSTA:
 *                 type: string
 *               dataPROPOSTA:
 *                 type: string
 *                 format: date-time
 *               observacaoPROPOSTA:
 *                 type: string
 *               transportadoraPROPOSTA:
 *                 type: integer
 *               envioPROPOSTA:
 *                 type: string
 *               lixeiraPROPOSTA:
 *                 type: string
 *               ativoPROPOSTA:
 *                 type: string
 *             example:
 *               pedidoPROPOSTA: 1
 *               usuarioPROPOSTA: 2
 *               vendedorPROPOSTA: 3
 *               clientePROPOSTA: 4
 *               nomePROPOSTA: "Proposta Teste"
 *               dataPROPOSTA: "2024-12-20T12:00:00Z"
 *               observacaoPROPOSTA: "Observação Teste"
 *               transportadoraPROPOSTA: 5
 *               envioPROPOSTA: "1"
 *               lixeiraPROPOSTA: "0"
 *               ativoPROPOSTA: "1"
 *     responses:
 *       201:
 *         description: Proposta criada com sucesso
 */
router.post("/", login.required, propostaMysqlController.create);

/**
 * @swagger
 * /api/propostas-web/{codigo}:
 *   put:
 *     summary: Atualizar uma proposta por ID
 *     tags: [Propostas Web]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         schema:
 *           type: integer
 *         required: true
 *         description: codigo da proposta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Proposta atualizada com sucesso
 *       404:
 *         description: Proposta não encontrada
 */
router.put("/:codigo", login.required, propostaMysqlController.update);

/**
 * @swagger
 * /api/propostas-web/{codigo}:
 *   delete:
 *     summary: Deletar uma proposta por ID
 *     tags: [Propostas Web]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         schema:
 *           type: integer
 *         required: true
 *         description: Codigo da proposta
 *     responses:
 *       204:
 *         description: Proposta deletada com sucesso
 *       404:
 *         description: Proposta não encontrada
 */
router.delete("/:codigo", login.required, propostaMysqlController.delete);

module.exports = router;
