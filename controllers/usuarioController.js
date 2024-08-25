const Usuario = require('../models/usuario'); // Modelo de usuario

exports.getUsuarioByEnv = async (req, res) => {
  try {
    const userName = process.env.USER_NAME; // Nombre del usuario desde las variables de entorno
    const usuarioModel = new Usuario(); // Crear instancia de Usuario
    const usuario = await usuarioModel.getUserByName(userName); // Obtener el usuario por nombre

    if (!usuario) {
      return res.status(404).send({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).send({ data: usuario });
  } catch (error) {
    res.status(500).send({ mensaje: "Error en el servidor", error: error.message });
  }
};


