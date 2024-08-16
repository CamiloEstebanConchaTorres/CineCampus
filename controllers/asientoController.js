const Asiento = require('../models/asiento');

exports.getAsientosByProyeccionId = async (req, res) => {
    let obj = new Asiento();
    res.status(200).send(await obj.getAsientosByProyeccionId(req.params.proyeccionId));
}

exports.reservarAsiento = async (req, res) => {
    let obj = new Asiento();
    res.status(200).send(await obj.reservarAsiento(req.params.asientoId));
}
