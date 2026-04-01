const Paciente = require("../models/paciente");
const Medico = require("../models/medico");
const Asistente = require("../models/asistente");
const Appointment = require("../models/citas");

exports.createAppointments = async (res, req) => {
    try {
        const { role } = req.usuario;

        if (role !== 1 && role !== 2) {
            return res.status(403).json({ 
                msg: 'Acceso denegado' 
            });
        }

        const {paciente_id, medico_id, fecha_hora, motivo} = req.body;

        const pacienteExiste = await Paciente.findById(paciente_id);
        if (!pacienteExiste) {
            return res.status(404).json({ msg: 'El paciente no existe' });
        }

        const nuevaCita = new Appointment({
            paciente: paciente_id,
            medico: medico_id,
            fecha_hora,
            motivo,
            status: 'Pendiente'
        });

        await nuevaCita.save();

        res.status(201).json({
            msg: 'Cita creada',
            cita: nuevaCita
        })
    } catch (error) {
        res.status(500).json({error: "Error en el servidor", message: error});
    }
    exports.getAllAppointments = async (req, res) => {
      try {
        const { role, id: usuarioId } = req.usuario;
        if (!['0', '1', '2', '3'].includes(String(role))) {
          return res.status(403).json({ msg: 'Acceso denegado' });
        }

        // Prepare filters per role
        const baseFilters = {
          pendientes: { status: 'pendiente' },
          canceladas: { status: 'cancelada' },
          completadas: { status: 'completada' }
        };

        // scope results: doctors see their own, patients see their own, assistants/admin see all
        if (String(role) === '1') {
          baseFilters.pendientes.medico_id = usuarioId;
          baseFilters.canceladas.medico_id = usuarioId;
          baseFilters.completadas.medico_id = usuarioId;
        } else if (String(role) === '3') {
          baseFilters.pendientes.paciente_id = usuarioId;
          baseFilters.canceladas.paciente_id = usuarioId;
          baseFilters.completadas.paciente_id = usuarioId;
        }

        const [pendientes, canceladas, completadas] = await Promise.all([
          Appointment.find(baseFilters.pendientes)
            .populate('paciente_id', 'username email')
            .populate('medico_id', 'username email')
            .sort({ fecha_hora: 1 }),
          Appointment.find(baseFilters.canceladas)
            .populate('paciente_id', 'username email')
            .populate('medico_id', 'username email')
            .sort({ fecha_hora: 1 }),
          Appointment.find(baseFilters.completadas)
            .populate('paciente_id', 'username email')
            .populate('medico_id', 'username email')
            .sort({ fecha_hora: 1 })
        ]);

        return res.status(200).json({ pendientes, canceladas, completadas });
      } catch (error) {
        res.status(500).json({ error: 'Error en el servidor', message: error.message || error });
      }
    };

exports.getSpecificAppointments = async (req, res) => {
  try {
    const { role, id: usuarioId } = req.usuario;
    // Allow authenticated roles; filtering below will scope results for patients
    if (!['0', '1', '2', '3'].includes(String(role))) {
      return res.status(403).json({ msg: 'Acceso denegado' });
    }

    const { id } = req.params; // optional appointment id
    const { doctor_id, date } = req.query; // optional query params

    // If an appointment id is provided, return that appointment (but enforce patient restriction)
    if (id) {
      const cita = await Appointment.findById(id)
        .populate('paciente_id', 'username email')
        .populate('medico_id', 'username email');

      if (!cita) return res.status(404).json({ msg: 'Cita no encontrada' });

      if (String(role) === '3' && String(cita.paciente_id._id) !== String(usuarioId)) {
        return res.status(403).json({ msg: 'Acceso denegado a esta cita' });
      }

      return res.status(200).json([cita]);
    }

    // Build filter for queries: by doctor_id and/or date
    const filter = {};
    if (doctor_id) {
      // validate doctor exists
      const medicoExiste = await Medico.findById(doctor_id);
      if (!medicoExiste) return res.status(404).json({ msg: 'Médico no encontrado' });
      filter.medico_id = doctor_id;
    }

    if (date) {
      // Accept dates like YYYY-MM-DD (server interprets as start of day UTC)
      const dayStart = new Date(date);
      if (isNaN(dayStart.getTime())) return res.status(400).json({ msg: 'Formato de fecha inválido' });
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      filter.fecha_hora = { $gte: dayStart, $lt: dayEnd };
    }

    // If requestor is a patient, restrict to their own appointments
    if (String(role) === '3') {
      filter.paciente_id = usuarioId;
    }

    const citas = await Appointment.find(filter)
      .populate('paciente_id', 'username email')
      .populate('medico_id', 'username email')
      .sort({ fecha_hora: 1 });

    return res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', message: error.message || error });
  }
};

//y que el paciente pueda buscar por fecha o por doctor en get especificappointments ✅
// hacer una validacion en donde si es doctor o asistnte, traer las citas pendientes(validar por status), puedan ver un historial de cancelas, y completadas(dividir por status) de todos los pacientes en lista✅
//y si es paciente, que pueda ver sus citas pendientes, canceladas y completadas(dividir por status)✅
}