import { Connect } from "../../helpers/db/Connect.js";

export class Compra extends Connect {
  static instanceCompra;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('compra');
    if (Compra.instanceCompra) {
      return Compra.instanceCompra;
    }
    Compra.instanceCompra = this;
    return this;
  }

  /**
 * Retrieves all compras from the 'compra' collection in the database.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of compras.
 *
 * @example
 * const compra = new Compra();
 * const allCompras = await compra.getAllCompras();
 * console.log(allCompras);
 */
  async getAllCompras() {
    await this.conexion.connect();
    const data = await this.collection.find().toArray();
    await this.conexion.close();
    return data;
  }
}