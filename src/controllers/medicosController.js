const Medico = require("../models/medico");

exports.getAllMedicos = async (req, res) => {
  try {
    // Select only the requested fields and map cedulaInterna -> cedula
    const medicos = await Medico.find().select('username especialidad cedulaInterna');

    const resultado = medicos.map(m => ({
      id: m._id,
      username: m.username,
      especialidad: m.especialidad,
      cedula: m.cedulaInterna || null
    }));

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor', message: error.message || error });
  }
};
