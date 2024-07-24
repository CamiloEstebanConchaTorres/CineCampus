import { Connect } from "../../helpers/db/Connect.js";

export class Pelicula extends Connect {
  static instancePelicula;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('pelicula');
    if (Pelicula.instancePelicula) {
      return Pelicula.instancePelicula;
    }
    Pelicula.instancePelicula = this;
    return this;
  }

/**
 * Retrieves all documents from the 'pelicula' collection in the database.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of documents representing the peliculas.
 *
 * @example
 * const pelicula = new Pelicula();
 * const peliculas = await pelicula.getAllPeliculas();
 * console.log(peliculas);
 */
  async getAllPeliculas() {
    await this.conexion.connect();
    const data = await this.collection.find().toArray();
    await this.conexion.close();
    return data;
  }
}