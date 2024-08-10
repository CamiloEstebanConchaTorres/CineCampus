const Asiento = require('../models/asiento');

exports.getAllAsientos = async (req, res) => {
  let obj = new Asiento();
  res.status(200).send(await obj.getAllAsientos());
}

exports.getOneAsiento = async (req, res) => {
  let obj = new Asiento();
  res.status(200).send(await obj.getOneAsiento(req.params));
}