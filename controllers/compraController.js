
const Compra = require('../models/compra');


exports.actualizarReserva = async (req, res) => {
    let obj = new Compra();
    try {
        const { boletos, usuarioId } = req.body;
        const result = await obj.actualizarReserva(boletos, usuarioId);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error al actualizar la reserva:', error); // Registro detallado del error
        res.status(500).send({ mensaje: 'Error al actualizar la reserva', error: error.message });
    }
    obj.destructor();
}

exports.liberarAsientos = async (req, res) => {
    let obj = new Compra();
    try {
        const { asientos } = req.body;
        const result = await obj.liberarAsientos(asientos);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error al liberar los asientos:', error);
        res.status(500).send({ mensaje: 'Error al liberar los asientos', error: error.message });
    }
    obj.destructor();
}