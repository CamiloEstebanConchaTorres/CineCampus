const express = require ('express');
const router = express.Router();

const usuarioController = require("../controllers/usuarioController")


router.get('/usuarios', usuarioController.getAllUsuarios);
router.get('/usuario/:email', usuarioController.getUsuarioByEmail);

module.exports = router;