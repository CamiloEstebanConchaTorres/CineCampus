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
    
    async liberarAsientos(asientos) {
        await this.conexion.connect();

        // Actualizar el estado de cada asiento a "disponible"
        for (let asiento of asientos) {
            const asientoId = new ObjectId(asiento.asiento_id);

            // Actualizar el estado del asiento a "disponible"
            await this.asientoCollection.updateOne(
                { _id: asientoId },
                { $set: { estado: 'disponible' } }
            );
        }

        await this.conexion.close();

        return { mensaje: "Asientos liberados con éxito" };
    }

    async crearCompra(compraData) {
        // Conectar si es necesario
        await this.conexion.connect();

        const { usuario_id, boleto, precio_total, metodo_pago, estado, fecha_compra, codigo_confirmacion } = compraData;

        // Insertar boletos en la colección
        const boletosIds = [];
        for (let boletoItem of boleto) {
            const result = await this.boletoCollection.insertOne(boletoItem);
            boletosIds.push(result.insertedId);
        }

        // Crear la compra
        const compra = {
            usuario_id: new ObjectId(usuario_id),
            boleto: boletosIds,
            precio_total: precio_total,
            metodo_pago: metodo_pago,
            estado: estado,
            fecha_compra: new Date(fecha_compra),
            codigo_confirmacion: codigo_confirmacion
        };

        const result = await this.compraCollection.insertOne(compra);
        await this.conexion.close();

        return {
            mensaje: "Compra realizada con éxito",
            compra_id: result.insertedId,
            codigo_confirmacion: codigo_confirmacion
        };
    }
    
}
