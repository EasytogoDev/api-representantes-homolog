const express = require("express");
const router = express.Router();
const transportadorasController = require("../controllers/transportadorasController");
const login = require("../middleware/login"); // Middleware de autenticação

/**
 * @swagger
 * tags:
 *   name: Transportadoras
 *   description: Endpoints relacionados às transportadoras
 */

/**
 * @swagger
 * /api/transportadoras:
 *   get:
 *     summary: Lista todas as transportadoras
 *     description: Recupera uma lista paginada de transportadoras.
 *     tags: [Transportadoras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de registros por página.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Posição inicial para paginação.
 *     responses:
 *       200:
 *         description: Lista de transportadoras retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: integer
 *                     description: Código da transportadora.
 *                   FANTASIA:
 *                     type: string
 *                     description: Nome fantasia da transportadora.
 *                   RAZAO:
 *                     type: string
 *                     description: Razão social da transportadora.
 *                   CNPJ:
 *                     type: string
 *                     description: CNPJ da transportadora.
 *                   PASTA:
 *                     type: string
 *                     description: Código ou pasta associada.
 *                   DATA:
 *                     type: string
 *                     format: date
 *                     description: Data de criação da transportadora.
 *       500:
 *         description: Erro ao recuperar a lista de transportadoras.
 */
router.get("/", login.required, transportadorasController.getTransportadoras);

/**
 * @swagger
 * /api/transportadoras/cliente/{codigo}:
 *   get:
 *     summary: Lista transportadoras associadas a um cliente específico
 *     description: Recupera transportadoras vinculadas ao código do cliente fornecido.
 *     tags: [Transportadoras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código do cliente.
 *     responses:
 *       200:
 *         description: Lista de transportadoras associadas ao cliente retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   codigo:
 *                     type: integer
 *                     description: Código da transportadora.
 *                   FANTASIA:
 *                     type: string
 *                     description: Nome fantasia da transportadora.
 *                   RAZAO:
 *                     type: string
 *                     description: Razão social da transportadora.
 *                   CNPJ:
 *                     type: string
 *                     description: CNPJ da transportadora.
 *                   PASTA:
 *                     type: string
 *                     description: Código ou pasta associada.
 *                   DATA:
 *                     type: string
 *                     format: date
 *                     description: Data de criação da transportadora.
 *       404:
 *         description: Nenhuma transportadora encontrada para o cliente.
 *       500:
 *         description: Erro ao recuperar as transportadoras do cliente.
 */
router.get(
  "/cliente/:codigo",
  login.required,
  transportadorasController.getTransportadorasPorCliente
);
 
/**
 * @swagger
 * /api/transportadoras/{id}:
 *   get:
 *     summary: Recupera informações detalhadas de uma transportadora
 *     description: Recupera os detalhes de uma transportadora com base no ID fornecido.
 *     tags: [Transportadoras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transportadora.
 *     responses:
 *       200:
 *         description: Detalhes da transportadora retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo:
 *                   type: integer
 *                   description: Código da transportadora.
 *                 FANTASIA:
 *                   type: string
 *                   description: Nome fantasia da transportadora.
 *                 RAZAO:
 *                   type: string
 *                   description: Razão social da transportadora.
 *                 CNPJ:
 *                   type: string
 *                   description: CNPJ da transportadora.
 *                 PASTA:
 *                   type: string
 *                   description: Código ou pasta associada.
 *                 DATA:
 *                   type: string
 *                   format: date
 *                   description: Data de criação da transportadora.
 *       404:
 *         description: Transportadora não encontrada.
 *       500:
 *         description: Erro ao recuperar os detalhes da transportadora.
 */
router.get("/:id", login.required, transportadorasController.getTransportadorasPorId);

module.exports = router;
