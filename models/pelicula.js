const { ObjectId } = require ("mongodb");
const  Connect = require ("../config/connect");

module.exports = class Pelicula extends Connect {
  static instancePelicula;
  db;
  collection;
  proyeccionCollection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('pelicula');
    this.proyeccionCollection = this.db.collection('proyeccion');
    if (Pelicula.instancePelicula) {
      return Pelicula.instancePelicula;
    }
    Pelicula.instancePelicula = this;
    return this;
  }

  async getAllPeliculas() {
    await this.conexion.connect();
    const data = await this.collection.find({}, { projection: { titulo: 1, genero: 1, duracion: 1, imagen: 1, fechaEstreno: 1, actores: 1, sinopsis: 1, trailer: 1 } }).toArray();
    await this.conexion.close();
    return { mensaje: "Lista de Películas:", data: data };
  }


  async getPeliculaById(id) {
    await this.conexion.connect();
    const pelicula = await this.collection.findOne({ _id: new ObjectId(id) });
    if (pelicula) {
      const proyecciones = await this.proyeccionCollection.find({ pelicula_id: new ObjectId(id) }).toArray();
      pelicula.proyecciones = proyecciones;
    }
    await this.conexion.close();
    return { mensaje: pelicula ? "Película Encontrada:" : "Película No Encontrada:", data: pelicula };
  }
}