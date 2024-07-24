import { Connect } from "../../helpers/db/Connect.js";

export class Boleto extends Connect {
  static instanceBoleto;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('boleto');
    if (Boleto.instanceBoleto) {
      return Boleto.instanceBoleto;
    }
    Boleto.instanceBoleto = this;
    return this;
  }
  
  /**
 * Retrieves all boletos from the database.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of boleto documents.
 *
 * @example
 * const boleto = new Boleto();
 * const allBoletos = await boleto.getAllBoletos();
 * console.log(allBoletos);
 */

  async getAllBoletos() {
    await this.conexion.connect();
    const data = await this.collection.find().toArray();
    await this.conexion.close();
    return data;
  }
}