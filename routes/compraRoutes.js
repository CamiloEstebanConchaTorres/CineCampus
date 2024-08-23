const express = require('express');
const router = express.Router();

const compraController = require("../controllers/compraController");

router.post('/reserva', compraController.actualizarReserva);
router.post('/liberar-asientos', compraController.liberarAsientos);

module.exports = router;
