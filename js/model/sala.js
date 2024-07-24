import { Connect } from "../../helpers/db/Connect.js";

export class Sala extends Connect {
  static instanceSala;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('sala');
    if (Sala.instanceSala) {
      return Sala.instanceSala;
    }
    Sala.instanceSala = this;
    return this;
  }

  /**
 * Retrieves all salas from the database.
 *
 * @returns {Promise<Array>} An array of salas. Each sala is represented as an object.
 *
 * @example
 * const salas = await Sala.getAllSalas();
 * console.log(salas);
 * // Output: [ { _id: ObjectId('5f12345678901234567890ab'), name: 'Sala 1', capacity: 100 }, ... ]
 */
  async getAllSalas() {
    await this.conexion.connect();
    const data = await this.collection.find().toArray();
    await this.conexion.close();
    return data;
  }
}