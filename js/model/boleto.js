import { Connect } from "../../helpers/db/Connect.js";
import { ObjectId } from "mongodb"; // importamos para poder filtrar y actualizar por id

export class Boleto extends Connect {
  static instanceBoleto;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('boleto');
    this.asientoCollection = this.db.collection('asiento'); // lo añadimos para manejar coleccion asiento
    this.compraCollection = this.db.collection('compra'); // lo añadiimos para manejar la colección 'compra'
    if (Boleto.instanceBoleto) {
      return Boleto.instanceBoleto;
    }
    Boleto.instanceBoleto = this;
    return this;
  }

  /**
 * Retrieves all boletos from the database.
 *
 * @returns {Promise<Array>} An array of boletos. Each boleto is represented as an object with the following properties:
 * - _id: The unique identifier of the boleto.
 * - proyeccion_id: The unique identifier of the proyeccion.
 * - asiento_id: The unique identifier of the asiento.
 * - usuario_id: The unique identifier of the usuario.
 * - precio: The original price of the boleto.
 * - descuento: The discount applied to the boleto.
 * - precio_final: The final price of the boleto after applying the discount.
 * - estado: The current state of the boleto, which can be 'pagado' or 'anulado'.
 * - fecha_compra: The date and time when the boleto was purchased.
 */
  async getAllBoletos() {
    await this.conexion.connect();
    const data = await this.collection.find().toArray();
    await this.conexion.close();
    return data;
  }


  //Caso de uso 2. Compra de Boletos:
  //API para Comprar Boletos: Permitir la compra de boletos para una película específica, incluyendo la selección de la fecha y la hora de la proyección.

  /**
 * This function handles the process of purchasing a boleto for a specific proyeccion and asiento.
 * It also updates the asiento status to 'ocupado' and creates a new compra record.
 *
 * @param {string} proyeccionId - The unique identifier of the proyeccion.
 * @param {string} asientoId - The unique identifier of the asiento.
 * @param {string} usuarioId - The unique identifier of the usuario.
 * @param {number} precio - The original price of the boleto.
 * @param {number} descuento - The discount applied to the boleto.
 * @param {string} metodoPago - The method of payment used for the compra.
 *
 * @returns {Promise<Object>} An object containing the following properties:
 * - message: A message indicating the success or failure of the compra.
 * - boleto: The newly created boleto object if the compra was successful.
 * - asientoActualizado: An object representing the updated asiento with its new estado.
 * - compra: The newly created compra object if the compra was successful.
 *
 * @throws {Error} If the asiento is not available or if the compra fails.
 */

  // creamos la funcion para comprar un boleto para ver una proyeccion
  async comprarBoleto(proyeccionId, asientoId, usuarioId, precio, descuento, metodoPago) {
    await this.conexion.connect();
    // verificamos que el asiento al que queremos estar despues de ver la disponibilidad de asientos en una proyeccion este disponible
    const asiento = await this.asientoCollection.findOne({ _id: new ObjectId(asientoId), estado: 'disponible' });
    if (!asiento) {
      await this.conexion.close();
      throw new Error('El asiento no está disponible');
    }
    //si esta disponible procedemos a cargar los datos de la compra de un boleto
    // calculamos un precio fijo menos el descuento por si el usuario es VIP
    const precioFinal = precio - descuento;
    const boleto = {
      // datos necesaarios para la compra del boleto
      proyeccion_id: new ObjectId(proyeccionId),
      asiento_id: new ObjectId(asientoId),
      usuario_id: new ObjectId(usuarioId),
      precio: precio,
      descuento: descuento,
      precio_final: precioFinal,
      estado: 'pagado',
      fecha_compra: new Date()
    };
    // si todo es correcto insertamos los datos de la nueva compra en la coleccion boleto
    const result = await this.collection.insertOne(boleto);
    // y actualizamos el asiento que estaba disponible a ocupado en la coleccion asiento
    await this.asientoCollection.updateOne({ _id: new ObjectId(asientoId) }, { $set: { estado: 'ocupado' } });
    // aca tenemos encuenta la coleccion compra, que es en la cual se guarda el reporte de cada compra de un usuario agregando el metodo de pago y su codigo de confirmacion unico
    const compra = {
      // estos sin los datos necesarios
      usuario_id: new ObjectId(usuarioId),
      boleto: [result.insertedId.toString()],
      precio_total: precioFinal,
      metodo_pago: metodoPago,
      estado: "completada",
      fecha_compra: new Date(), // esta fecha tomara la
      codigo_confirmacion: "CONF" + Math.floor(Math.random() * 1000000000) // generamos un codigo de confirmacion
    };
    // si todo es correcto insertamos un nuevo dato en la coleccion compra
    await this.compraCollection.insertOne(compra);
    // aca procedemos a devolver el mensaje de exito en la compra de un boleto y las actualicaciones que se hicieron ya mencionadas
    if (result.insertedId) {
      const boletoInsertado = await this.collection.findOne({ _id: result.insertedId });
      await this.conexion.close();
      // retornamos el mensaje si pudo ser comprado
      return {
        message: 'Boleto comprado exitosamente',
        boleto: boletoInsertado,
        asientoActualizado: {
          _id: asientoId,
          estado: 'ocupado'
        },
        compra: compra
      };
    } else {
      // si no un mensaje de que no se pudo
      await this.conexion.close();
      throw new Error('No se pudo comprar el boleto');
    }
  }
}
