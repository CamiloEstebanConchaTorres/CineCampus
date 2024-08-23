
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
