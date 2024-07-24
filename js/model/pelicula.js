import { ObjectId } from "mongodb"; // importamos ObjectId de mongodb para poder realizar filtros por id unico
import { Connect } from "../../helpers/db/Connect.js";

export class Pelicula extends Connect {
  static instancePelicula;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('pelicula');
    this.proyeccionCollection = this.db.collection('proyeccion'); // nos conectamos a la coleccion de proyeccion, para realizar consultas de la proyeccion de cada pelicula
    if (Pelicula.instancePelicula) {
      return Pelicula.instancePelicula;
    }
    Pelicula.instancePelicula = this;
    return this;
  }

  
  // Caso de uso 1. Selección de Películas: /////////////////////////////////////////////////////////////////////////////

  /**
 * Retrieves all movies from the catalog.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of movie objects.
 * Each movie object contains the 'titulo', 'genero', and 'duracion' properties.
 *
 * @example
 * const peliculas = await getAllPeliculas();
 * console.log(peliculas);
 * // Output: [{ titulo: 'Movie 1', genero: 'Action', duracion: 120 }, ...]
 */
  // creamos la funcion con la cual realizamos la primera api para consultar todas las peliculas de un catalogo 
  async getAllPeliculas() {
    await this.conexion.connect();
    // filtramos por titulo genero y duracion de cada pelicula que existe en el catalogo
    const data = await this.collection.find({}, { projection: { titulo: 1, genero: 1, duracion: 1} }).toArray();
    await this.conexion.close();
    return data;
  }

  /**
 * Retrieves a movie by its ID, including related projection details.
 *
 * @param {string} id - The unique identifier of the movie.
 * @returns {Promise<Object|null>} A promise that resolves to a movie object if found,
 * or null if not found. The movie object contains the 'titulo', 'genero', 'duracion',
 * and 'proyecciones' properties. The 'proyecciones' property is an array of projection objects.
 *
 * @example
 * const pelicula = await getPeliculaById('5f9999999999999999999999');
 * console.log(pelicula);
 * // Output: { titulo: 'Movie 1', genero: 'Action', duracion: 120, proyecciones: [...] }
 */
  // ahora creamos la funcion para realizar la segunda api que nos permite consultar cada pelicula que existe en el catalogo pero con detalles de cada punto, como sinopsis, clasificacion, director etc ademas de sus proyecciones y detalles
  async getPeliculaById(id) {
    await this.conexion.connect();
    //filtramos por el id de cada pelicula donde ademas traemos los datos de sus proyecciones que se ven relacionadas en otra coleccion llamada: proyeccion
    const pelicula = await this.collection.findOne({ _id: new ObjectId(id) });
    if (pelicula) {
      const proyecciones = await this.proyeccionCollection.find({ pelicula_id: new ObjectId(id) }).toArray();
      pelicula.proyecciones = proyecciones;
    }
    await this.conexion.close();
    return pelicula;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}