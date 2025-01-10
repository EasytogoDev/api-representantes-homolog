const express = require("express");
const router = express.Router();
const login = require("../middleware/login");
const relatoriosController = require("../controllers/relatoriosController");

router.get("/", login.required, relatoriosController.fetchRelatorio);

module.exports = router;
