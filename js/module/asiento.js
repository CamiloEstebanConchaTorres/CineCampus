const { ObjectId } = require("mongodb");
const  Connect = require ("../../helpers/connect");

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


  async getAllAsientos() {
    await this.conexion.connect();
    const data = await this.collection.find({}).toArray();
    await this.conexion.close();
    return { mensaje: "Lista de Asientos:", data: data}
  }

  async getOneAsiento({_id}) {
    await this.conexion.connect();
    try {
      const [data] = await this.collection.find({_id: new ObjectId(_id)}).toArray();
      return { mensaje: "Asiento Encontrado:", data: data}
    } catch (error) {
      return { mensaje: "Asiento No Encontrado:", data: _id}
    }finally{
      await this.conexion.close();
    }
  }
}