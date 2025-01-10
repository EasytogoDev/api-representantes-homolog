const express = require("express");
const router = express.Router();
const exportarProdutos = require("../controllers/exportarProdutosController");
const login = require("../middleware/login");

router.post("/produtos", exportarProdutos.enviarProduto);
router.post("/empresas", exportarProdutos.cadastrarEmpresa);
router.post("/vincular-fabricantes-produtos", exportarProdutos.vincularFabricanteComProduto);

module.exports = router;
