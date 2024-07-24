import { Connect } from "../../helpers/db/Connect.js";

export class Asiento extends Connect {
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

  /**
 * Retrieves all asientos from the 'pelicula' collection in the database.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of asiento documents.
 *
 * @example
 * const asiento = new Asiento();
 * const allAsientos = await asiento.getAllAsientos();
 * console.log(allAsientos);
 */
  async getAllAsientos() {
    await this.conexion.connect();
    const data = await this.collection.find().toArray();
    await this.conexion.close();
    return data;
  }
}