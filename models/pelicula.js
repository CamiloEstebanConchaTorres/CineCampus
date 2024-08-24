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
    const data = await this.collection.find({}, { projection: { titulo: 1, genero: 1, duracion: 1, imagen: 1, fechaEstreno: 1, actores: 1, sinopsis: 1, trailer: 1, rol: 1 } }).toArray();
    await this.conexion.close();
    return { mensaje: "Lista de Películas:", data: data };
  }

  async getPeliculaById(id) {
    await this.conexion.connect();
    const pelicula = await this.collection.findOne({ _id: new ObjectId(id) });

    if (pelicula) {
        const proyecciones = await this.proyeccionCollection.aggregate([
            { $match: { pelicula_id: new ObjectId(id) } },
            {
                $lookup: {
                    from: 'sala',
                    localField: 'sala_id',
                    foreignField: '_id',
                    as: 'sala_info'
                }
            },
            {
                $lookup: {
                    from: 'asiento',
                    localField: 'sala_id',
                    foreignField: 'sala_id',
                    as: 'asientos'
                }
            },
            { $unwind: "$asientos" },
            {
                $sort: {
                    "fechaHora": 1, // Ordenar por fechaHora (de la más cercana a la más lejana)
                    "asientos.fila": 1,
                    "asientos.numero_asiento": 1,
                    "asientos.sala_id": 1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    pelicula_id: { $first: "$pelicula_id" },
                    sala_id: { $first: "$sala_id" },
                    fechaHora: { $first: "$fechaHora" },
                    precio: { $first: "$precio" },
                    estado: { $first: "$estado" },
                    sala_info: { $first: "$sala_info" },
                    asientos: { $push: "$asientos" },
                }
            }
        ]).toArray();

        // Agrupa proyecciones por fecha y añade los horarios y asientos
        const proyeccionesPorFecha = {};

        proyecciones.forEach(proyeccion => {
            const fecha = new Date(proyeccion.fechaHora).toLocaleDateString();
            const hora = new Date(proyeccion.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (!proyeccionesPorFecha[fecha]) {
                proyeccionesPorFecha[fecha] = {
                    fecha: fecha,
                    precio: proyeccion.precio,
                    sala: proyeccion.sala_info[0].tipo,
                    horarios: [],
                    asientos: proyeccion.asientos.map(asiento => ({
                        _id: asiento._id.toString(),
                        fila: asiento.fila,
                        numero_asiento: asiento.numero_asiento,
                        tipo: asiento.tipo,
                        estado: asiento.estado
                    }))
                };
            }

            proyeccionesPorFecha[fecha].horarios.push(hora);
        });

        // Ordena las fechas de la más cercana a la más lejana
        const fechasOrdenadas = Object.values(proyeccionesPorFecha).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        // Ordena los horarios dentro de cada fecha
        fechasOrdenadas.forEach(fechaObj => {
            fechaObj.horarios.sort((a, b) => new Date(`1970-01-01T${a}:00`) - new Date(`1970-01-01T${b}:00`));
        });

        pelicula.proyecciones = fechasOrdenadas;
    }

    await this.conexion.close();
    return { mensaje: pelicula ? "Película Encontrada:" : "Película No Encontrada:", data: pelicula };
}



}