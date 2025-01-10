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
 * /api/produtos/all:
 *   get:
 *     summary: Obtém todos os produtos com informações detalhadas como embalagem, unidade de medida, etc.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de produtos a serem retornados.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de produtos a pular antes de começar a retornar os resultados.
 *     responses:
 *       200:
 *         description: Lista de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: integer
 *                     description: Código do produto.
 *                   sku:
 *                     type: string
 *                     description: SKU do produto.
 *                   Descricao:
 *                     type: string
 *                     description: Descrição do produto.
 *                   Altura:
 *                     type: number
 *                     description: Altura do produto.
 *                   Largura:
 *                     type: number
 *                     description: Largura do produto.
 *                   Comprimento:
 *                     type: number
 *                     description: Comprimento do produto.
 *                   Peso:
 *                     type: number
 *                     description: Peso do produto.
 *                   Barras:
 *                     type: string
 *                     description: Código de barras do produto.
 *                   UN:
 *                     type: string
 *                     description: Unidade de medida do produto.
 *                   PASTA:
 *                     type: string
 *                     description: Pasta associada ao produto.
 *                   GTINS:
 *                     type: array
 *                     description: Detalhes das embalagens associadas ao produto.
 *                     items:
 *                       type: object
 *                       properties:
 *                         EMBALAGEM:
 *                           type: string
 *                           description: Nome da embalagem.
 *                         GTIN:
 *                           type: string
 *                           description: Código GTIN da embalagem.
 *                         QUANTIDADE:
 *                           type: number
 *                           description: Quantidade de produtos na embalagem.
 *                         UNIDADE:
 *                           type: string
 *                           description: Unidade de medida associada à embalagem.
 *                         PADRAO:
 *                           type: boolean
 *                           description: Indica se a embalagem é padrão.
 *       500:
 *         description: Erro ao buscar dados do produto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada.
 */

/**
 * @swagger
 * /api/produtos/arvores-produtos/{produto}:
 *   get:
 *     summary: Busca as árvores de produtos associadas ao produto especificado.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produto
 *         schema:
 *           type: string
 *         required: true
 *         description: Código do produto para buscar suas árvores.
 *     responses:
 *       200:
 *         description: Detalhes das árvores de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   principalSUBPRODUTO:
 *                     type: integer
 *                     description: Código do produto principal na árvore.
 *                   partnumberPRODUTO:
 *                     type: string
 *                     description: SKU do produto.
 *                   nomePRODUTO:
 *                     type: string
 *                     description: Nome ou descrição do produto.
 *                   nomeUNIDADEMEDIDA:
 *                     type: string
 *                     description: Unidade de medida do produto.
 *                   qtdeSUBPRODUTO:
 *                     type: number
 *                     description: Quantidade do subproduto.
 *                   custounitarioSUBPRODUTO:
 *                     type: number
 *                     description: Custo unitário do subproduto.
 *                   custototalSUBPRODUTO:
 *                     type: number
 *                     description: Custo total do subproduto.
 *       404:
 *         description: Não foi possível encontrar a árvore de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada.
 *       500:
 *         description: Erro ao buscar árvore de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada.
 */

/**
 * @swagger
 * /api/produtos/produtos-arvores/{produto}:
 *   get:
 *     summary: Busca produtos que estão contidos em uma árvore de produtos.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produto
 *         schema:
 *           type: string
 *         required: true
 *         description: Código do produto para buscar os produtos contidos na árvore.
 *     responses:
 *       200:
 *         description: Detalhes dos produtos contidos na árvore.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   principalSUBPRODUTO:
 *                     type: integer
 *                     description: Código do produto principal na árvore.
 *                   partnumberPRODUTO:
 *                     type: string
 *                     description: SKU do produto.
 *                   nomePRODUTO:
 *                     type: string
 *                     description: Nome ou descrição do produto.
 *                   nomeUNIDADEMEDIDA:
 *                     type: string
 *                     description: Unidade de medida do produto.
 *                   qtdeSUBPRODUTO:
 *                     type: number
 *                     description: Quantidade do subproduto.
 *                   custounitarioSUBPRODUTO:
 *                     type: number
 *                     description: Custo unitário do subproduto.
 *                   custototalSUBPRODUTO:
 *                     type: number
 *                     description: Custo total do subproduto.
 *       404:
 *         description: Não foi possível encontrar os produtos contidos na árvore.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada.
 *       500:
 *         description: Erro ao buscar produtos contidos na árvore.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada.
 */

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Obtém dados detalhados dos produtos de um vendedor específico.
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de produtos a serem retornados.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de produtos a pular antes de começar a retornar os resultados.
 *     responses:
 *       200:
 *         description: Dados detalhados dos produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: integer
 *                     description: Código do produto.
 *                   sku:
 *                     type: string
 *                     description: SKU do produto.
 *                   Descricao:
 *                     type: string
 *                     description: Descrição do produto.
 *                   Unidade:
 *                     type: string
 *                     description: Unidade de medida do produto.
 *                   preco:
 *                     type: number
 *                     description: Preço do produto.
 *                   quantidade:
 *                     type: number
 *                     description: Quantidade do produto disponível.
 *       500:
 *         description: Erro ao obter dados do produto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro detalhada.
 */
/* 
router.get("/all", login.optional, produtosController.buscarTodosProdutos);
router.get(
  "/arvores-produtos/:produto",
  login.optional,
  produtosController.buscarArvoresDeProdutos
);
router.get(
  "/produtos-arvores/:produto",
  login.optional,
  produtosController.buscarProdutoContidosEmUmaArvore
);
router.get(
  "/tabela-precos/:produto",
  login.optional,
  produtosController.buscarTabelaDePrecos
);
router.get("/", login.optional, produtosController.getProdutoData); */



/**
 * @swagger
 * /api/produtos/{produto}:
 *   get:
 *     summary: Busca produtos para um determinado Cliente
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produto
 *       - in: path
 *         name: empresa
 *       - in: path
 *         name: vendedor
 *         schema:
 *           type: string
 *         required: true
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
  "/:produto",
  login.optional,
  produtosController.getProdutoData
);

module.exports = router;
