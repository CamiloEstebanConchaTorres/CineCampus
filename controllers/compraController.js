const Compra = require('../models/compra');

exports.iniciarCompra = async (req, res) => {
    let obj = new Compra();
    const { boleto, usuarioId, metodoPago, reserva } = req.body;
    const result = await obj.iniciarCompra(boleto, usuarioId, metodoPago, reserva);
    res.status(200).send(result);
}

exports.cancelarReserva = async (req, res) => {
    let obj = new Compra();
    const compraId = req.params.compraId;
    const result = await obj.cancelarReserva(compraId);
    res.status(200).send(result);
}
