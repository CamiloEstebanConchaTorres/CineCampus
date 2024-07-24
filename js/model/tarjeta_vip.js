import { Connect } from "../../helpers/db/Connect.js";

export class Vip extends Connect {
  static instanceVip;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('tarjeta_vip');
    if (Vip.instanceVip) {
      return Vip.instanceVip;
    }
    Vip.instanceVip = this;
    return this;
  }

  /**
 * Retrieves all records from the 'tarjeta_vip' collection in the database.
 *
 * @returns {Promise<Array>} An array of objects representing the records from the 'tarjeta_vip' collection.
 *
 * @example
 * const vip = new Vip();
 * const vipData = await vip.getAllVip();
 * console.log(vipData);
 */
  async getAllVip() {
    await this.conexion.connect();
    const data = await this.collection.find().toArray();
    await this.conexion.close();
    return data;
  }
}