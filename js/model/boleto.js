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
    this.tarjetaVIPCollection = this.db.collection('tarjeta_vip');// agregamos la coleccion de tarjetas para verificaciones
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
  
  //Caso de uso 3. Asignación de Asientos:
  //API para Reservar Asientos: Permitir la selección y reserva de asientos para una proyección específica.
  
  /**
 * This function handles the process of reserving a seat for a specific proyeccion and asiento.
 * It also updates the asiento status to 'reservado' and creates a new compra record.
 *
 * @param {string} proyeccionId - The unique identifier of the proyeccion.
 * @param {string} asientoId - The unique identifier of the asiento.
 * @param {string} usuarioId - The unique identifier of the usuario.
 * @param {number} precio - The original price of the boleto.
 * @param {number} descuento - The discount applied to the boleto.
 * @param {string} metodoPago - The method of payment used for the compra.
 *
 * @returns {Promise<Object>} An object containing the following properties:
 * - message: A message indicating the success or failure of the reserva.
 * - boleto: The newly created boleto object if the reserva was successful.
 * - asientoActualizado: An object representing the updated asiento with its new estado.
 * - compra: The newly created compra object if the reserva was successful.
 *
 * @throws {Error} If the asiento is not available or if the reserva fails.
 */

  // creamos la funcion para reservar un asiento 
  async reservarAsiento(proyeccionId, asientoId, usuarioId, precio, descuento, metodoPago) {
    await this.conexion.connect();
    // verificamos que el asiento este en estado disponible
    const asiento = await this.asientoCollection.findOne({ _id: new ObjectId(asientoId), estado: 'disponible' });
    if (!asiento) {
      await this.conexion.close();
      throw new Error('El asiento no está disponible');
    }
  // calculamos un precio final por si el usuario es vip y se le hace un descuento
    const precioFinal = precio - descuento;
    // datos importantes para una reserva
    const boleto = {
      proyeccion_id: new ObjectId(proyeccionId),
      asiento_id: new ObjectId(asientoId),
      usuario_id: new ObjectId(usuarioId),
      precio: precio,
      descuento: descuento,
      precio_final: precioFinal,
      estado: 'reservado',
      fecha_reserva: new Date()
    };
    // si todo es correcto insertamos con exito esa reserva en boleto
    const result = await this.collection.insertOne(boleto);
    // ademas actualizamos el estado de ese asiento a reservado
    await this.asientoCollection.updateOne({ _id: new ObjectId(asientoId) }, { $set: { estado: 'reservado' } });
    // tambien actualizamos los datos de una nueva compra en la coleccion compra
    const compra = {
      usuario_id: new ObjectId(usuarioId),
      boleto: [result.insertedId.toString()],
      precio_total: precioFinal,
      metodo_pago: metodoPago,
      estado: "reservada",
      fecha_compra: new Date(),
      codigo_confirmacion: "CONF" + Math.floor(Math.random() * 1000000000)
    };
    // si los datos coinciden  con el boleto los insertamos correctamente
    await this.compraCollection.insertOne(compra);
    // mostramos un mensaje de exito para la reserva de un asiento
    if (result.insertedId) {
      const boletoInsertado = await this.collection.findOne({ _id: result.insertedId });
      await this.conexion.close();
      return {
        message: 'Asiento reservado exitosamente',
        boleto: boletoInsertado,
        asientoActualizado: {
          _id: asientoId,
          estado: 'reservado'
        },
        compra: compra
      };
    } else {
      await this.conexion.close();
      throw new Error('No se pudo reservar el asiento');
    }
  }

    
  //Caso de uso 3. Asignación de Asientos:
  //API para Cancelar Reserva de Asientos: Permitir la cancelación de una reserva de asiento ya realizada.
  
  /**
 * This function handles the cancellation of a previously reserved seat.
 * It updates the status of the reservation in the 'compra' and 'boleto' collections,
 * and changes the seat status in the 'asiento' collection to 'disponible'.
 *
 * @param {string} compraId - The unique identifier of the compra (purchase) record.
 * @param {string} asientoId - The unique identifier of the asiento (seat) record.
 *
 * @returns {Promise<Object>} An object containing a success message if the cancellation is successful.
 * @throws {Error} If the compra record does not exist or if the cancellation fails.
 */

  // luego creamos una funcion para poder cancelar una reserva de un asiento 
   async cancelarReserva(compraId, asientoId) {
    await this.conexion.connect();
    // validamos que el dato de una compra ya echa exista para poder cancelarla si es necesario
    const compra = await this.compraCollection.findOne({ _id: new ObjectId(compraId) });
    if (!compra) {
      await this.conexion.close();
      throw new Error('La compra no existe');
    }
    // si existe accedemos al primero elemento que coincida con esa compra
    const boletoId = compra.boleto[0];
    // para proceder a cancelarla mediante updateone
    const resultCompra = await this.compraCollection.updateOne(
      { _id: new ObjectId(compraId) },
      { $set: { estado: 'cancelada' } }
    );
    // al igual que la cancelamos en la coleccion boleto
    const resultBoleto = await this.collection.updateOne(
      { _id: new ObjectId(boletoId) },
      { $set: { estado: 'cancelada' } }
    );
    // luego generamos el mensaje de exito de una reserva cancelada y actualizamos el asiento reservado a un estado disponible
    if (resultCompra.modifiedCount === 1 && resultBoleto.modifiedCount === 1) {
      await this.asientoCollection.updateOne({ _id: new ObjectId(asientoId) }, { $set: { estado: 'disponible' } });
      await this.conexion.close();
      return { message: 'Reserva cancelada exitosamente' };
    } else {
      await this.conexion.close();
      throw new Error('No se pudo cancelar la reserva');
    }
  }


  // Caso de uso 4. Descuentos y Tarjetas VIP:
  // API para Aplicar Descuentos: Permitir la aplicación de descuentos en la compra de boletos para usuarios con tarjeta VIP.
  // API para Verificar Tarjeta VIP: Permitir la verificación de la validez de una tarjeta VIP durante el proceso de compra.
  
  /**
 * This function handles the purchase of a VIP ticket with a discount applied.
 * It checks the availability of the VIP seat, verifies the validity of the VIP card,
 * applies the appropriate discount based on the VIP card level, and creates a new purchase record.
 *
 * @param {string} proyeccionId - The unique identifier of the projection.
 * @param {string} asientoId - The unique identifier of the seat.
 * @param {string} usuarioId - The unique identifier of the user.
 * @param {number} precio - The original price of the ticket.
 * @param {string} metodoPago - The payment method used for the purchase.
 *
 * @returns {Promise<Object>} An object containing a success message if the purchase is successful.
 * @throws {Error} If the seat is not available or not VIP, or if the user does not have a valid VIP card.
 */

  // creamos la funcion para comprar un boleto, pero solo aplica para usuarios vip:
  async comprarBoletoConDescuento(proyeccionId, asientoId, usuarioId, precio, metodoPago) {
    await this.conexion.connect();
    // Verificar disponibilidad del asiento y que sea de tipo VIP
    const asiento = await this.asientoCollection.findOne({ _id: new ObjectId(asientoId), estado: 'disponible', tipo: 'vip' });
    if (!asiento) {
      await this.conexion.close();
      throw new Error('El asiento no está disponible o no es de tipo VIP');
    }
    // si es un asiento vip, ahora Verificamos la tarjeta VIP del usuario que este activa
    const tarjetaVIP = await this.tarjetaVIPCollection.findOne({
      usuario_id: new ObjectId(usuarioId),
      estado: 'activa'
    });
    if (!tarjetaVIP) {
      await this.conexion.close();
      throw new Error('El usuario no tiene una tarjeta VIP válida');
    }
    // si la tarjeta del usuario es valida, ahora aplicamos la sigiente logica de descuento, dependiendo del nivel de tarjeta vip
    let descuento = 0;
    switch (tarjetaVIP.nivel_vip) {
      case 'oro':
        descuento = precio * 0.20;
        break;
      case 'plata':
        descuento = precio * 0.15;
        break;
      case 'bronce':
        descuento = precio * 0.10;
        break;
      default:
        await this.conexion.close();
        throw new Error('Nivel VIP no reconocido');
    }
    // calculamos el precio final
    const precioFinal = precio - descuento; 
    // Crear el objeto del boleto, con los datos necesarios
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
    // si todo es correcto insertamos la compra del vip
    const result = await this.collection.insertOne(boleto);
    // y Actualizamos el estado del asiento a ocupado
    await this.asientoCollection.updateOne({ _id: new ObjectId(asientoId) }, { $set: { estado: 'ocupado' } });
    // de la misma forma para la coleccion compra para llevar el registro de esta nueva compra vip
    const compra = {
      usuario_id: new ObjectId(usuarioId),
      boleto: [result.insertedId.toString()],
      precio_total: precioFinal,
      metodo_pago: metodoPago,
      estado: "completada",
      fecha_compra: new Date(),
      codigo_confirmacion: "CONF" + Math.floor(Math.random() * 1000000000)
    };
    // si todo es correcto y coincide insertamos el nuevo dato
    await this.compraCollection.insertOne(compra);
    // por ultimo creamos el mensaje de exito de compra o si hubo un error
    if (result.insertedId) {
      const boletoInsertado = await this.collection.findOne({ _id: result.insertedId });
      await this.conexion.close();
      return {
        message: 'Boleto comprado exitosamente con descuento VIP',
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

