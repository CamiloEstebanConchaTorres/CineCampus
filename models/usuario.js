const { ObjectId } = require ("mongodb");
const  Connect = require ("../config/connect");

module.exports = class Usuario extends Connect {
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

  async getAllUsuarios() {
    await this.conexion.connect();
    const data = await this.collection.find({}, { projection: { email: 1, rol: 1, pwd: 1, imagen: 1, nombre: 1 } }).toArray();
    await this.conexion.close();
    return { mensaje: "Lista de Usuarios:", data: data };
  }

  // Añadir en la clase Usuario
  async getUsuarioByEmail(email) {
    await this.conexion.connect();
    const data = await this.collection.findOne({ email: email }, { projection: { email: 1, nombre: 1, imagen_user: 1 } });
    await this.conexion.close();
    if (!data) {
        throw new Error("Usuario no encontrado");
    }
    return data;
  }

}