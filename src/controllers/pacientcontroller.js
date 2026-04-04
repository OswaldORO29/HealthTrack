const Paciente = require("../models/paciente");

exports.getAllPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find().select('username email');

    const resultado = pacientes.map(p => ({
      id: p._id,
      username: p.username,
      email: p.email
    }));

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor', message: error.message || error });
  }
};