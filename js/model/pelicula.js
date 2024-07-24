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


  // creamos la funcion con la cual realizamos la primera api para consultar todas las peliculas de un catalogo 
  async getAllPeliculas() {
    await this.conexion.connect();
    // filtramos por titulo genero y duracion de cada pelicula que existe en el catalogo
    const data = await this.collection.find({}, { projection: { titulo: 1, genero: 1, duracion: 1} }).toArray();
    await this.conexion.close();
    return data;
  }

}