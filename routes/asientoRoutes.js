const express = require('express');
const router = express.Router();
const asientoController = require('../controllers/asientoController');

router.get('/asiento', asientoController.getAllAsientos);
router.get('/asiento/:_id', asientoController.getOneAsiento);

module.exports = router;