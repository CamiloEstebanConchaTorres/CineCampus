const express = require('express');
const router = express.Router();

const compraController = require("../controllers/compraController");

router.post('/reserva', compraController.actualizarReserva);

module.exports = router;
