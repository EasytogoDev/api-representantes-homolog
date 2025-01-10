const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhook");
const login = require("../middleware/login"); // Middleware de autenticação

/**
 * @swagger
 * tags:
 *   name: Webhook
 *   description: Endpoints para processar propostas e itens através de webhooks
 */

/**
 * @swagger
 * /api/retorno/vendas:
 *   post:
 *     summary: Retorna informações de uma proposta de vendas e seus itens
 *     description: Processa uma proposta de vendas e seus itens. Executa uma procedure no SQL Server.
 *     tags: [Webhook]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proposta
 *               - statuswms
 *               - usuario
 *               - itens
 *             properties:
 *               proposta:
 *                 type: integer
 *                 description: Código da proposta.
 *               statuswms:
 *                 type: integer
 *                 description: 2 para liberado por wms.
 *               usuario:
 *                 type: integer
 *                 description: Código do usuário.
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - codigoItem
 *                     - produtoItem
 *                     - quantidadeItem
 *                     - statusItem
 *                   properties:
 *                     codigoItem:
 *                       type: integer
 *                       description: Código do item.
 *                     produtoItem:
 *                       type: integer
 *                       description: Código do produto associado ao item.
 *                     quantidadeItem:
 *                       type: integer
 *                       description: Quantidade do produto.
 *                     statusItem:
 *                       type: integer
 *                       description: Status do item.
 *     responses:
 *       201:
 *         description: OK. A proposta e os itens foram processados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: string
 *                   example: "OK"
 *       500:
 *         description: Erro no servidor ao processar a proposta ou itens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Erro ao criar a proposta."
 */
router.post("/vendas", login.required, webhookController.webhookVendas);

/**
 * @swagger
 * /api/retorno/compras:
 *   post:
 *     summary: Retorna informações de uma proposta de compras e seus itens
 *     description: Processa uma proposta de compras e seus itens. Executa uma procedure no SQL Server.
 *     tags: [Webhook]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proposta
 *               - statuswms
 *               - usuario
 *               - itens
 *             properties:
 *               proposta:
 *                 type: integer
 *                 description: Código da proposta.
 *               statuswms:
 *                 type: integer
 *                 description: 2 para liberado por wms.
 *               usuario:
 *                 type: integer
 *                 description: Código do usuário.
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - codigoItem
 *                     - produtoItem
 *                     - quantidadeItem
 *                     - statusItem
 *                   properties:
 *                     codigoItem:
 *                       type: integer
 *                       description: Código do item.
 *                     produtoItem:
 *                       type: integer
 *                       description: Código do produto associado ao item.
 *                     quantidadeItem:
 *                       type: integer
 *                       description: Quantidade do produto.
 *                     statusItem:
 *                       type: integer
 *                       description: Status do item.
 *     responses:
 *       201:
 *         description: OK. A proposta e os itens foram processados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: string
 *                   example: "OK"
 *       500:
 *         description: Erro no servidor ao processar a proposta ou itens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Erro ao criar a proposta."
 */
router.post("/compras", login.required, webhookController.webhookCompras);

/**
 * @swagger
 * /api/retorno/op:
 *   post:
 *     summary: Retorna informações de uma proposta de OP (Ordem de Produção) e seus itens
 *     description: Processa uma proposta de OP e seus itens. Executa uma procedure no SQL Server.
 *     tags: [Webhook]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proposta
 *               - statuswms
 *               - usuario
 *               - itens
 *             properties:
 *               proposta:
 *                 type: integer
 *                 description: Código da proposta.
 *               statuswms:
 *                 type: integer
 *                 description: 2 para liberado por wms.
 *               usuario:
 *                 type: integer
 *                 description: Código do usuário.
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - codigoItem
 *                     - produtoItem
 *                     - quantidadeItem
 *                     - statusItem
 *                   properties:
 *                     codigoItem:
 *                       type: integer
 *                       description: Código do item.
 *                     produtoItem:
 *                       type: integer
 *                       description: Código do produto associado ao item.
 *                     quantidadeItem:
 *                       type: integer
 *                       description: Quantidade do produto.
 *                     statusItem:
 *                       type: integer
 *                       description: Status do item.
 *     responses:
 *       201:
 *         description: OK. A proposta e os itens foram processados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: string
 *                   example: "OK"
 *       500:
 *         description: Erro no servidor ao processar a proposta ou itens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: "Erro ao criar a proposta."
 */
router.post("/op", login.required, webhookController.webhookOP);

module.exports = router;
