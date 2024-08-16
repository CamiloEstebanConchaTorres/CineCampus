const express = require('express');
const router = express.Router();

const asientoController = require("../controllers/asientoController");

router.get('/asientos/:proyeccionId', asientoController.getAsientosByProyeccionId);
router.post('/reservar/:asientoId', asientoController.reservarAsiento);

module.exports = router;
