const { ObjectId } = require("mongodb");
const Connect = require("../config/connect");

module.exports = class Compra extends Connect {
    static instanceCompra;
    db;
    boletoCollection;
    compraCollection;
    asientoCollection;

    constructor() {
        super();
        this.db = this.conexion.db(this.getDbName);
        this.boletoCollection = this.db.collection('boleto');
        this.compraCollection = this.db.collection('compra');
        this.asientoCollection = this.db.collection('asiento');
        if (Compra.instanceCompra) {
            return Compra.instanceCompra;
        }
        Compra.instanceCompra = this;
        return this;
    }

    async iniciarCompra(boletos, usuarioId, metodoPago, reserva = false) {
        await this.conexion.connect();

        let totalPrecio = 0;
        let boletoIds = [];

        // Crear cada boleto y actualizar el estado del asiento
        for (let boleto of boletos) {
            const asientoId = new ObjectId(boleto.asiento_id);
            const precioFinal = boleto.precio - boleto.descuento;
            totalPrecio += precioFinal;

            const nuevoBoleto = {
                proyeccion_id: new ObjectId(boleto.proyeccion_id),
                asiento_id: asientoId,
                usuario_id: new ObjectId(usuarioId),
                precio: boleto.precio,
                descuento: boleto.descuento,
                precio_final: precioFinal,
                estado: reserva ? 'pendiente' : 'pagado',
                fecha_compra: new Date()
            };

            // Guardar boleto en la base de datos
            const resultadoBoleto = await this.boletoCollection.insertOne(nuevoBoleto);
            boletoIds.push(resultadoBoleto.insertedId);

            // Actualizar el estado del asiento a "reservado" o "comprado"
            const nuevoEstado = reserva ? 'reservado' : 'comprado';
            await this.asientoCollection.updateOne(
                { _id: asientoId },
                { $set: { estado: nuevoEstado } }
            );
        }

        // Crear el registro de la compra
        const nuevaCompra = {
            usuario_id: new ObjectId(usuarioId),
            boleto: boletoIds,
            precio_total: totalPrecio,
            metodo_pago: reserva ? 'N/A' : metodoPago,
            estado: reserva ? 'pendiente' : 'completada',
            fecha_compra: new Date(),
            codigo_confirmacion: reserva ? null : this.generarCodigoConfirmacion()
        };

        const resultadoCompra = await this.compraCollection.insertOne(nuevaCompra);
        await this.conexion.close();

        return {
            mensaje: reserva ? "Reserva iniciada con éxito" : "Compra completada con éxito",
            compraId: resultadoCompra.insertedId,
            boletos: boletoIds,
            codigo_confirmacion: reserva ? null : nuevaCompra.codigo_confirmacion
        };
    }

    async cancelarReserva(compraId) {
        await this.conexion.connect();

        const compra = await this.compraCollection.findOne({ _id: new ObjectId(compraId) });

        if (!compra || compra.estado !== 'pendiente') {
            await this.conexion.close();
            return { mensaje: "Reserva no encontrada o ya procesada" };
        }

        // Revertir el estado de los asientos a "disponible"
        for (let boletoId of compra.boleto) {
            const boleto = await this.boletoCollection.findOne({ _id: new ObjectId(boletoId) });

            if (boleto) {
                await this.asientoCollection.updateOne(
                    { _id: new ObjectId(boleto.asiento_id) },
                    { $set: { estado: 'disponible' } }
                );
            }
        }

        // Eliminar los boletos y la compra
        await this.boletoCollection.deleteMany({ _id: { $in: compra.boleto } });
        await this.compraCollection.deleteOne({ _id: new ObjectId(compraId) });

        await this.conexion.close();
        return { mensaje: "Reserva cancelada y asientos liberados" };
    }

    generarCodigoConfirmacion() {
        return 'CONF' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    
    async actualizarReserva(boletos, usuarioId) {
        await this.conexion.connect();
    
        // Actualizar el estado de cada asiento a "reservado"
        for (let boleto of boletos) {
            const asientoId = new ObjectId(boleto.asiento_id);
    
            // Actualizar el estado del asiento a "reservado"
            await this.asientoCollection.updateOne(
                { _id: asientoId },
                { $set: { estado: 'reservado' } }
            );
        }
    
        await this.conexion.close();
    
        return { mensaje: "Reservas actualizadas con éxito" };
    }    
    
}
