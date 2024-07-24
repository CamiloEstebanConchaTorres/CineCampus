import { Connect } from "../../helpers/db/Connect.js";

export class Usuario extends Connect {
  static instanceUsuario;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('usuario');
    if (Usuario.instanceUsuario) {
      return Usuario.instanceUsuario;
    }
    Usuario.instanceUsuario = this;
    return this;
  }

  /**
 * Retrieves all users from the 'usuario' collection in the database.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 *
 * @example
 * const usuario = new Usuario();
 * usuario.getAllUsuarios().then(users => {
 *   console.log(users);
 * });
 */
  async getAllUsuarios() {
    await this.conexion.connect();
    const data = await this.collection.find().toArray();
    await this.conexion.close();
    return data;
  }
}