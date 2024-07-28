import { Connect } from "../../helpers/db/Connect.js";
import bcrypt from 'bcrypt'; // importamos esta libreria que nos permite verificar una contraseña mediante el hashing, para contraseñas muy seguras
import { v4 as uuidv4 } from 'uuid'; // importamos esta libreria muy importante para generear las uuids de cada usuario en mongo ya que es unico
import { ObjectId } from "mongodb"; // importamos para poder filtrar y actualizar por id

export class Usuario extends Connect {
  static instanceUsuario;
  db;
  collection;

  constructor() {
    super();
    this.db = this.conexion.db(this.getDbName);
    this.collection = this.db.collection('usuario');
    if (Usuario.instanceUsuario) {
      return Usuario.instanceUsuario;
    }
    Usuario.instanceUsuario = this;
    return this;
  }

  /**

 * Retrieves all users from the 'usuario' collection in the database.
   *
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
   *
 * @example
 * const usuario = new Usuario();
 * usuario.getAllUsuarios().then(users => {
 * console.log(users);
 * });
   */
  async getAllUsuarios() {
   await this.conexion.connect();
   const data = await this.collection.find().toArray();
   await this.conexion.close();
   return data;
     }

  async crearUsuario(nombre, apellido, email, password, rol) {
    await this.conexion.connect(); 
    // Hashing de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // Creación del nuevo usuario en la colección de usuarios
    const newUser = {
      nombre,
      apellido,
      email,
      password: hashedPassword, // Guardamos la contraseña hasheada // si es por ejemplo 456, se hasheara a una contraseña mucho mas segura
      rol,
      fechaRegistro: new Date(),
      ultimoAcceso: new Date()
    };
    const result = await this.collection.insertOne(newUser);

     // Creación del usuario en la base de datos de autenticación de MongoDB
     const dbUser = {
      _id: `CineCampus.${nombre.toLowerCase()}`, // tenemos en cuenta la base de datos y en minuscula su nombre para un id mas apropiado a el cine
      userId: uuidv4(), // Generamos su UUID único para ese usuario este uuid es para mongo como tal
      user: nombre.toLowerCase(), // usuario siempre en minuscula
      db: 'CineCampus',
      roles: [{ role: `${rol}Role`, db: 'CineCampus' }],
      mechanisms: ['SCRAM-SHA-1']
    };
    // creamos el usuario
    await this.db.command({
      createUser: dbUser.user,
      pwd: password,
      roles: dbUser.roles
    });
    await this.conexion.close(); 
    // creamos el mensaje para devolver detalles del usuario creado
    const message = {
      message: 'Usuario creado exitosamente',
      userDetails: {
        nombre,
        apellido,
        email,
        rol,
        fechaRegistro: newUser.fechaRegistro,
        ultimoAcceso: newUser.ultimoAcceso
      },
      dbUserDetails: {
        _id: dbUser._id,
        userId: dbUser.userId,
        user: dbUser.user,
        roles: dbUser.roles,
        mechanisms: dbUser.mechanisms
      }
    };
    return message;
  }

  // ahora creamos la funcion para poder obtener todos los detalles de un usuario por su id
  async obtenerDetallesUsuario(id) {
    await this.conexion.connect();
    const user = await this.collection.findOne({ _id: new ObjectId(id) });
    await this.conexion.close();
    return user;
  }
  // ahora creamos la funcion para actualizar el rol de un usuario tanto en la coleccion como en la autenticacion de mongo
  // busco primero el usuario por su id para validar que exista
  async actualizarRolUsuario(id, nuevoRol) {
    await this.conexion.connect();
    
    // Buscar el usuario en la colección
    const user = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      await this.conexion.close();
      throw new Error('Usuario no encontrado');
    }
  
    // Actualizar el rol del usuario en la colección
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { rol: nuevoRol } }
    );
  
    // Actualizar el rol en la base de datos de autenticación de MongoDB
    const dbUser = {
      user: user.nombre.toLowerCase(),
      db: 'CineCampus',
      roles: [{ role: `${nuevoRol}Role`, db: 'CineCampus' }]
    };
    
    // Ejecutar el comando para actualizar el usuario en MongoDB
    await this.db.command({
      updateUser: dbUser.user,
      roles: dbUser.roles
    });
    
    await this.conexion.close();
  
    // Crear el mensaje de éxito
    const message = {
      message: 'Rol del usuario actualizado exitosamente',
      userDetails: {
        id: id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: nuevoRol,
        fechaRegistro: user.fechaRegistro,
        ultimoAcceso: user.ultimoAcceso
      },
      dbUserDetails: {
        user: dbUser.user,
        roles: dbUser.roles
      }
    };
  
    return message;
  }
}