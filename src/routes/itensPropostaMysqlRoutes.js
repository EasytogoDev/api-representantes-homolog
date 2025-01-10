const express = require("express");
const router = express.Router();
const itensPropostaMysqlController = require("../controllers/itensPropostaMysqlController");
const login = require("../middleware/login"); // Middleware de autenticação

/**
 * @swagger
 * tags:
 *   name: Itens Proposta Web
 *   description: API para gerenciamento de itens de proposta
 */

/**
 * @swagger
 * /api/itens-proposta-web/verifica-pendencias/{proposta}:
 *   get:
 *     summary: Verificar pendências de itens não importados
 *     description: Verifica se há itens não importados para uma determinada proposta.
 *     tags: [Itens Proposta Web]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: proposta
 *         required: true
 *         schema:
 *           type: integer
 *         description: Código da proposta a ser verificada.
 *         example: 321654
 *     responses:
 *       200:
 *         description: Resultado da verificação de pendências.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indica se existem pendências ou não.
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   description: Mensagem sobre o status das pendências.
 *                   example: "Ainda existem itens não importados"
 *                 pendentes:
 *                   type: integer
 *                   description: Quantidade de itens não importados, retornado apenas se houver pendências.
 *                   example: 5
 *       404:
 *         description: Proposta não encontrada ou não existem pendências.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indica que não existem pendências.
 *                   example: false
 *                 mensagem:
 *                   type: string
 *                   description: Mensagem informando que não há pendências.
 *                   example: "Não existem pendências"
 *       500:
 *         description: Erro ao verificar pendências.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem detalhando o erro ocorrido.
 *                   example: "Erro ao verificar pendências."
 */

router.get(
  "/verifica-pendencias/:proposta",
  login.required,
  itensPropostaMysqlController.verificaItensNaoImportados
);

router.get(
  "/processa-itens",
  login.required,
  itensPropostaMysqlController.processaItensImportadosViaExcel
);
/**
 * @swagger
 * /api/itens-proposta-web/{proposta}:
 *   get:
 *     summary: Buscar itens por proposta
 *     tags: [Itens Proposta Web]
 *     parameters:
 *       - in: path
 *         name: proposta
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código da proposta
 *     responses:
 *       200:
 *         description: Lista de itens da proposta
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Proposta não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Itens não encontrados para a proposta informada"
 */
router.get(
  "/:proposta",
  login.required,
  itensPropostaMysqlController.getByProposta
);
/**
 * @swagger
 * /api/itens-proposta-web:
 *   post:
 *     summary: Criar um novo item de proposta
 *     tags: [Itens Proposta Web]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proposta:
 *                 type: integer
 *                 description: ID da proposta
 *               produto:
 *                 type: integer
 *                 description: ID do produto
 *               partnumber:
 *                 type: string
 *                 description: Partnumber do produto
 *               nomeitem:
 *                 type: string
 *                 description: Nome do item
 *               quantidade:
 *                 type: integer
 *                 description: Quantidade do item
 *               embalagempadrao:
 *                 type: integer
 *                 description: Embalagem padrão do item
 *               unidade:
 *                 type: string
 *                 description: Unidade do item
 *               valor:
 *                 type: number
 *                 description: Valor unitário do item
 *               ipi:
 *                 type: number
 *                 description: Percentual do IPI aplicado ao item
 *               ativo:
 *                 type: integer
 *                 description: Status ativo do item (1 para ativo, 0 para inativo)
 *             example:
 *               proposta: 123
 *               produto: 456
 *               partnumber: "P12345"
 *               nomeitem: "Produto Exemplo"
 *               quantidade: 10
 *               embalagempadrao: 5
 *               unidade: "UN"
 *               valor: 15.5
 *               ipi: 5.0
 *               ativo: 1
 *     responses:
 *       201:
 *         description: Item criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 propostaITEMPROPOSTA:
 *                   type: integer
 *                   example: 123
 *                 produtoITEMPROPOSTA:
 *                   type: integer
 *                   example: 456
 *                 partnumberITEMPROPOSTA:
 *                   type: string
 *                   example: "P12345"
 *                 nomeITEMPROPOSTA:
 *                   type: string
 *                   example: "Produto Exemplo"
 *                 quantidadeITEMPROPOSTA:
 *                   type: integer
 *                   example: 10
 *                 embalagempadraoITEMPROPOSTA:
 *                   type: integer
 *                   example: 5
 *                 unidadeITEMPROPOSTA:
 *                   type: string
 *                   example: "UN"
 *                 valorITEMPROPOSTA:
 *                   type: number
 *                   example: 15.5
 *                 valorxquantidadeITEMPROPOSTA:
 *                   type: number
 *                   example: 155.0
 *                 ipiITEMPROPOSTA:
 *                   type: number
 *                   example: 5.0
 *                 valoripiITEMPROPOSTA:
 *                   type: number
 *                   example: 7.75
 *                 valorstITEMPROPOSTA:
 *                   type: number
 *                   example: 3.0
 *                 valortotalITEMPROPOSTA:
 *                   type: number
 *                   example: 165.75
 *                 ativoITEMPROPOSTA:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Erro ao criar item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao criar item: Detalhes do erro"
 */
router.post("/", login.required, itensPropostaMysqlController.create);

/**
 * @swagger
 * /api/itens-proposta-web/importar:
 *   post:
 *     summary: Importar itens de proposta
 *     description: Endpoint para importar itens de proposta a partir de um JSON enviado no corpo da requisição.
 *     tags: [Itens Proposta Web]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 produto:
 *                   type: integer
 *                   description: Código do produto.
 *                   example: 123456
 *                 proposta:
 *                   type: integer
 *                   description: Código da proposta associada ao item.
 *                   example: 321654
 *                 quantidade:
 *                   type: integer
 *                   description: Quantidade do item.
 *                   example: 12
 *     responses:
 *       200:
 *         description: Itens importados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   itemITEMPROPOSTA:
 *                     type: integer
 *                     description: Índice do item importado.
 *                     example: 1
 *                   produtoITEMPROPOSTA:
 *                     type: integer
 *                     description: Código do produto importado.
 *                     example: 123456
 *                   quantidadeITEMPROPOSTA:
 *                     type: integer
 *                     description: Quantidade do produto importado.
 *                     example: 12
 *                   usuarioITEMPROPOSTA:
 *                     type: integer
 *                     description: Código do vendedor associado.
 *                     example: 1001
 *                   pedidoITEMPROPOSTA:
 *                     type: integer
 *                     description: Código da proposta importada.
 *                     example: 321654
 *                   gerouITEMPROPOSTA:
 *                     type: integer
 *                     description: Indicador de geração do item.
 *                     example: 0
 *       500:
 *         description: Erro ao processar itens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao processar itens."
 */

router.post(
  "/importar",
  login.required,
  itensPropostaMysqlController.importarItens
);

/**
 * @swagger
 * /api/itens-proposta-web/{id}:
 *   patch:
 *     summary: Atualizar um item de proposta por ID
 *     tags: [Itens Proposta Web]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantidadeITEMPROPOSTA:
 *                 type: integer
 *               valorITEMPROPOSTA:
 *                 type: number
 *             example:
 *               quantidadeITEMPROPOSTA: 20
 *               valorITEMPROPOSTA: 18.5
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
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
 *                   example: "Item atualizado com sucesso"
 *                 item:
 *                   type: object
 *       404:
 *         description: Item não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Item não encontrado"
 */
router.patch("/:id", login.required, itensPropostaMysqlController.update);

/**
 * @swagger
 * /api/itens-proposta-web/{id}:
 *   delete:
 *     summary: Deletar um item de proposta por ID
 *     tags: [Itens Proposta Web]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do item
 *     responses:
 *       204:
 *         description: Item deletado com sucesso
 *       404:
 *         description: Item não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Item não encontrado"
 *       500:
 *         description: Erro ao deletar item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao deletar item"
 */
router.delete("/:id", login.required, itensPropostaMysqlController.delete);

module.exports = router;
