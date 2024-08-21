
const Compra = require('../models/compra');

exports.iniciarCompra = async (req, res) => {
    let obj = new Compra();
    try {
        const { boleto, usuarioId, metodoPago, reserva } = req.body;
        const result = await obj.iniciarCompra(boleto, usuarioId, metodoPago, reserva);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error al iniciar la compra:', error); // Registro detallado del error
        res.status(500).send({ mensaje: 'Error al iniciar la compra', error: error.message });
    }
}



exports.cancelarReserva = async (req, res) => {
    let obj = new Compra();
    const compraId = req.params.compraId;
    const result = await obj.cancelarReserva(compraId);
    res.status(200).send(result);
}
