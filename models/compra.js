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
    
}
