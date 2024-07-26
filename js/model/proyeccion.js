import { ObjectId } from "mongodb"; // importamos ObjectId de mongodb para poder realizar filtros por id unico
import { Connect } from "../../helpers/db/Connect.js";

export class Proyeccion extends Connect {
  static instanceProyeccion;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('proyeccion');
    this.asientoCollection = this.db.collection('asiento');
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

  // creamos la funcion para verificar que exista la proyeccion que queremos buscar y filtramos la disponibilidad de sus asientos dependiendo de la sala de esa proyeccion
  async verificarDisponibilidadAsientos(proyeccionId) {
    await this.conexion.connect();
    // verificamos que la proyeccion exista
    const proyeccion = await this.collection.findOne({ _id: new ObjectId(proyeccionId) });
    if (!proyeccion) {
      await this.conexion.close();
      throw new Error('Proyección no encontrada');
    }
    //si existe procedemos a obtener todos los datos de los asientos de la sala correspondiente
    const asientos = await this.asientoCollection.find({ sala_id: proyeccion.sala_id }).toArray();
    // luego clasificamos mediante filter los asientos según su estado para que identifiquemos cual esta disponible ocupado etc
    const asientosDisponibles = asientos.filter(a => a.estado === 'disponible');
    const asientosOcupados = asientos.filter(a => a.estado === 'ocupado');
    const asientosReservados = asientos.filter(a => a.estado === 'reservado');
    // y agrupamos los datos por su cantidad ademas de sus detalles para que sepan si es un asiento vip regular o de discapacitados
    const disponibilidad = {
      total: asientos.length,
      disponibles: asientosDisponibles.length,
      ocupados: asientosOcupados.length,
      reservados: asientosReservados.length,
      detalles: {
        disponibles: asientosDisponibles,
        ocupados: asientosOcupados,
        reservados: asientosReservados
      }
    };
    await this.conexion.close();
    return disponibilidad;
  }
}