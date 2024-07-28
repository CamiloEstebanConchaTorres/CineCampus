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


  // Caso de uso 5. Roles Definidos
  // Roles Definidos:
  // Administrador:** Tiene permisos completos para gestionar el sistema, incluyendo la venta de boletos en el lugar físico. Los administradores no están involucrados en las compras en línea realizadas por los usuarios.
  // Usuario Estándar:** Puede comprar boletos en línea sin la intervención del administrador.
  // Usuario VIP:** Puede comprar boletos en línea con descuentos aplicables para titulares de tarjetas VIP.
  // API para Crear Usuario:** Permitir la creación de nuevos usuarios en el sistema, asignando roles y privilegios específicos (usuario estándar, usuario VIP o administrador).
  // API para Obtener Detalles de Usuario:** Permitir la consulta de información detallada sobre un usuario, incluyendo su rol y estado de tarjeta VIP.
  // API para Actualizar Rol de Usuario:** Permitir la actualización del rol de un usuario (por ejemplo, cambiar de usuario estándar a VIP, o viceversa).
  // API para Listar Usuarios:** Permitir la consulta de todos los usuarios del sistema, con la posibilidad de filtrar por rol (VIP, estándar o administrador).
  
  /**
  Creates a new user in the system and registers them in the authentication database.
  @param {string} nombre - The first name of the user.
  @param {string} apellido - The last name of the user.
  @param {string} email - The email address of the user.
  @param {string} password - The password of the user.
  @param {string} rol - The role of the user (Administrador, Usuario Estándar, Usuario VIP).
  @returns {Promise
  <Object>
  } A promise that resolves to an object containing the success message and user details.
  @example
  const usuario = new Usuario();
  usuario.crearUsuario('John', 'Doe', 'johndoe@example.com', 'password123', 'Usuario Estándar')
  .then(response => {
  console.log(response);
  });
  */
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

  /**
 * Retrieves user details from the database by their unique identifier.
 *
 * @param {string} id - The unique identifier of the user.
 * @returns {Promise<Object>} A promise that resolves to the user object if found, or null if not found.
 *
 * @example
 * const usuario = new Usuario();
 * usuario.obtenerDetallesUsuario('5f89277a1234567890abcdef')
 * .then(user => {
 * console.log(user);
 * });
 */

  // ahora creamos la funcion para poder obtener todos los detalles de un usuario por su id
  async obtenerDetallesUsuario(id) {
    await this.conexion.connect();
    const user = await this.collection.findOne({ _id: new ObjectId(id) });
    await this.conexion.close();
    return user;
  }

    /**
  Updates the role of a user in the system and in the authentication database.
  @param {string} id - The unique identifier of the user.
  @param {string} nuevoRol - The new role for the user (Administrador, Usuario Estándar, Usuario VIP).
  @returns {Promise
  <Object>
  } A promise that resolves to an object containing the success message and user details.
  @throws {Error} If the user is not found.
  @example
  const usuario = new Usuario();
  usuario.actualizarRolUsuario('5f89277a1234567890abcdef', 'Usuario VIP')
  .then(response => {
  console.log(response);
  });
  */

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

  /**
 * Retrieves a list of users from the database based on a given role filter.
 *
 * @param {string} [filtroRol=null] - The role to filter users by. If not provided, all users will be returned.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 *
 * @throws {Error} If there is an error connecting to the database.
 *
 * @example
 * const usuario = new Usuario();
 * usuario.listarUsuarios('Usuario Estándar')
 * .then(users => {
 * console.log(users);
 * });
 *
 * @example
 * const usuario = new Usuario();
 * usuario.listarUsuarios()
 * .then(users => {
 * console.log(users);
 * });
 */

  //por ultimo creamos una funcion que nos permita filtrar los datos de los usuarios por su rol
  async listarUsuarios(filtroRol = null) {
    await this.conexion.connect();
    const query = filtroRol ? { rol: filtroRol } : {};
    const users = await this.collection.find(query).toArray();
    await this.conexion.close();
    return users;
  }
}