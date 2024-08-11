const Usuario = require('../models/usuario');

exports.getUserInfo = async (req, res) => {
  const username = process.env.MONGO_USER;
  let obj = new Usuario();
  const userInfo = await obj.getUserInfo(username);
  if (userInfo) {
    res.status(200).json({ mensaje: "Información de usuario:", data: userInfo });
  } else {
    res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
}