const { ObjectId } = require("mongodb");
const Connect = require("../config/connect");

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

  async getUserInfo(username) {
    await this.conexion.connect();
    const user = await this.collection.findOne({ nombre: username });
    await this.conexion.close();
    return user ? { nombre: user.nombre, imagen: user.imagen } : null;
  }
}