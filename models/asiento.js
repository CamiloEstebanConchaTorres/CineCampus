const { ObjectId } = require("mongodb");
const Connect = require("../config/connect");

module.exports = class Asiento extends Connect {
    static instanceAsiento;
    db;
    collection;

    constructor() {
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('asiento');
        if (Asiento.instanceAsiento) {
            return Asiento.instanceAsiento;
        }
        Asiento.instanceAsiento = this;
        return this;
    }

    async getAsientosByProyeccionId(proyeccionId) {
        await this.conexion.connect();
        const asientos = await this.collection.find({ proyeccion_id: new ObjectId(proyeccionId) }).toArray();
        await this.conexion.close();
        return { mensaje: "Lista de Asientos:", data: asientos };
    }

    async reservarAsiento(asientoId) {
        await this.conexion.connect();
        const result = await this.collection.updateOne(
            { _id: new ObjectId(asientoId), disponible: true }, 
            { $set: { disponible: false } }
        );
        await this.conexion.close();
        return result.modifiedCount > 0 
            ? { mensaje: "Asiento reservado exitosamente" } 
            : { mensaje: "No se pudo reservar el asiento" };
    }
}
