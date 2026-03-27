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
}