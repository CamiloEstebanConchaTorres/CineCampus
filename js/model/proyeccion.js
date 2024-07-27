import { Connect } from "../../helpers/db/Connect.js";

export class Proyeccion extends Connect {
  static instanceProyeccion;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('proyeccion');
    this.asientoCollection = this.db.collection('asiento');// agregamos la coleccion asiento para buscar los disponibles
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

  // Caso de uso 2.Compra de Boletos:
  //API para Verificar Disponibilidad de Asientos: Permitir la consulta de la disponibilidad de asientos en una sala para una proyección específica.

/**
 * Verifies the availability of seats for a specific projection.
 *
 * @param {string} proyeccionId - The unique identifier of the projection.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the availability details.
 * The object has the following structure:
 * {
 *   total: number, // Total number of seats in the projection's hall.
 *   disponibles: number, // Number of available seats.
 *   ocupados: number, // Number of occupied seats.
 *   reservados: number, // Number of reserved seats.
 *   detalles: {
 *     disponibles: Array, // Array of available seat details.
 *     ocupados: Array, // Array of occupied seat details.
 *     reservados: Array, // Array of reserved seat details.
 *   }
 * }
 *
 * @throws {Error} If the projection is not found.
 *
 * @example
 * const proyeccion = new Proyeccion();
 * const disponibilidad = await proyeccion.verificarDisponibilidadAsientos('5f9999999999999999999999');
 * console.log(disponibilidad);
 */

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