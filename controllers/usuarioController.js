const Usuario = require ('../models/usuario');

exports.getAllUsuarios = async (req, res) => {
  let obj = new Usuario();
  res.status(200).send(await obj.getAllUsuarios());
  obj.destructor()
}

exports.getUsuarioByEmail = async (req, res) => {
  let obj = new Usuario();
  try {
      const result = await obj.getUsuarioByEmail(req.params.email);
      res.status(200).send(result);
  } catch (error) {
      res.status(500).send({ mensaje: "Error al obtener usuario", error });
  }
  obj.destructor();
}