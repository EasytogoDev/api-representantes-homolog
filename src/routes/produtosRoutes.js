

const express = require("express");
const router = express.Router();
const produtosController = require("../controllers/produtosController");
const login = require("../middleware/login");

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Operações relacionadas aos produtos
 */
 


/**
 * @swagger
 * /api/produtos/{empresa}:
 *   get:
 *     summary: Busca produtos para um determinado Cliente
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: produto
 *         schema:
 *           type: string 
 *         description: Código do produto a ser inserido na proposta.
 *       - in: path
 *         name: empresa
 *         schema:
 *           type: string
 *         required: true
 *         description: Código da empresa a ser inserido na proposta.
 *       - in: query
 *         name: vendedor
 *         schema:
 *           type: string
 *         required: true
 *         description: Código do vendedor a ser inserido na proposta.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: string 
 *         description: Código do produto a ser inserido na proposta.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string 
 *         description: Código do produto a ser inserido na proposta.
 *     responses:
 *       200:
 *         description: Produto inserido na proposta com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *       404:
 *         description: Produto não encontrado ou não visível para o vendedor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada.
 *       500:
 *         description: Erro ao inserir produto na proposta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada.
 */

router.get(
  "/:empresa",
  login.optional,
  produtosController.getProdutoData
);

module.exports = router;
