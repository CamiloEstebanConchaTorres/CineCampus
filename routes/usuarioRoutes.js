const express = require('express');
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.get('/usuario', usuarioController.getUserInfo);

module.exports = router;