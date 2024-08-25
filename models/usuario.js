const { ObjectId } = require('mongodb');
const Connect = require('../config/connect');

module.exports = class Usuario extends Connect {
  static instanceUsuario;
  db;
  collection;

  constructor() {
    super();
    if (!Usuario.instanceUsuario) {
      this.db = this.conexion.db; // Asegúrate de que `this.conexion.db` esté correctamente inicializado
      this.collection = this.db.collection('usuario'); // Nombre de la colección
      Usuario.instanceUsuario = this;
    }
    return Usuario.instanceUsuario;
  }

  async getUserByName(userName) {
    await this.conexion.connect();
    const usuario = await this.collection.findOne({ nombre: userName }); // Cambié 'user' a 'nombre'
    await this.conexion.close();
    return usuario;
  }
}
