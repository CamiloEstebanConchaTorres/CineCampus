const express = require('express');
const router = express.Router();

const compraController = require("../controllers/compraController");

router.post('/compra', compraController.iniciarCompra);
router.delete('/compra/:compraId', compraController.cancelarReserva);

module.exports = router;
