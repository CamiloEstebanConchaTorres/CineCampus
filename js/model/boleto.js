import { Connect } from "../../helpers/db/Connect.js";
import { ObjectId } from "mongodb"; 

export class Boleto extends Connect {
  static instanceBoleto;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('boleto');
    this.asientoCollection = this.db.collection('asiento'); 
    this.compraCollection = this.db.collection('compra'); // Añadido para manejar la colección 'compra'
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

  async comprarBoleto(proyeccionId, asientoId, usuarioId, precio, descuento, metodoPago) {
    await this.conexion.connect();

    const asiento = await this.asientoCollection.findOne({ _id: new ObjectId(asientoId), estado: 'disponible' });
    if (!asiento) {
      await this.conexion.close();
      throw new Error('El asiento no está disponible');
    }

    const precioFinal = precio - descuento;

    const boleto = {
      proyeccion_id: new ObjectId(proyeccionId),
      asiento_id: new ObjectId(asientoId),
      usuario_id: new ObjectId(usuarioId),
      precio: precio,
      descuento: descuento,
      precio_final: precioFinal,
      estado: 'pagado',
      fecha_compra: new Date()
    };

    const result = await this.collection.insertOne(boleto);

    await this.asientoCollection.updateOne({ _id: new ObjectId(asientoId) }, { $set: { estado: 'ocupado' } });

    const compra = {
      usuario_id: new ObjectId(usuarioId),
      boleto: [result.insertedId.toString()],
      precio_total: precioFinal,
      metodo_pago: metodoPago,
      estado: "completada",
      fecha_compra: new Date(),
      codigo_confirmacion: "CONF" + Math.floor(Math.random() * 1000000000)
    };

    await this.compraCollection.insertOne(compra);

    if (result.insertedId) {
      const boletoInsertado = await this.collection.findOne({ _id: result.insertedId });
      await this.conexion.close();
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
      await this.conexion.close();
      throw new Error('No se pudo comprar el boleto');
    }
  }
}
