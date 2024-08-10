const express = require ('express');
const router = express.Router();

const peliculaController = require("../controllers/peliculaController")


router.get('/pelicula', peliculaController.getAllPeliculas);
router.get('/pelicula/:_id', peliculaController.getPeliculaById);

module.exports = router;