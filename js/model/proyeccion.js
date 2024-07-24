import { Connect } from "../../helpers/db/Connect.js";

export class Proyeccion extends Connect {
  static instanceProyeccion;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('proyeccion');
    if (Proyeccion.instanceProyeccion) {
      return Proyeccion.instanceProyeccion;
    }
    Proyeccion.instanceProyeccion = this;
    return this;
  }

  /**
 * Retrieves all proyecciones from the 'proyeccion' collection in the database.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of proyecciones.
 *
 * @example
 * const proyeccion = new Proyeccion();
 * const allProyecciones = await proyeccion.getAllProyecciones();
 * console.log(allProyecciones);
 */
  async getAllProyecciones() {
    await this.conexion.connect();
    const data = await this.collection.find().toArray();
    await this.conexion.close();
    return data;
  }
}