const cron = require('node-cron');
const Paciente = require("../models/paciente");
const Appointment = require("../models/citas");

exports.createAppointments = async (req, res) => {
    try {
        const { role } = req.usuario;

        if (role > 2) {
            return res.status(403).json({ msg: 'Acceso denegado' });
        }

        const {paciente_id, medico_id, fecha_hora, motivo,status} = req.body;

        const pacienteExiste = await Paciente.findById(paciente_id);
        if (!pacienteExiste) {
            return res.status(404).json({ msg: 'El paciente no existe' });
        }
        const citaOcupada = await Appointment.findOne({
            medico_id,
            fecha_hora,
            status: { $ne: 'cancelada' }
        });
        if (citaOcupada) {
            return res.status(400).json({ msg: 'El médico ya tiene una cita programada para esta fecha y hora' });
        }
        const nuevaCita = new Appointment({
            paciente_id: paciente_id,
            medico_id: medico_id,
            fecha_hora,
            motivo,
            status
        });

        await nuevaCita.save();
        return res.status(201).json({msg: 'Cita creada, espere su confirmacion',cita: nuevaCita})
    } catch (error) {
        res.status(500).json({error: "Error en el servidor", message: error});
    }
}


exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoEstado } = req.body; 
        
        const estadosValidos = ['pendiente', 'confirmada','pendiente_aprobacion', 'cancelada', 'completada'];
        if (!estadosValidos.includes(nuevoEstado)) {
            return res.status(400).json({ msg: 'Estado no válido' });
        }

        const cita = await Appointment.findByIdAndUpdate(
            id, 
            { status: nuevoEstado }, 
            { returnDocument: 'after'}
        );

        if (!cita) return res.status(404).json({ msg: 'Cita no encontrada' });

        res.json({ msg:`Cita actualizada a ${nuevoEstado}`, cita });
    } catch (error) {
        res.status(500).json({error: "Error en el servidor", message: error});
    }
}

//limpia las citas viejas.
cron.schedule('* * * * *', async () => {
    const ahora = new Date();
    try {
        await Appointment.updateMany(
            { 
                fecha_hora: { $lt: ahora }, 
                status: 'confirmada' 
            },
            {$set:{status: 'completada'}}
        );
    } catch (error) {
        console.error('Error en el cron job:', error);
    }
});

exports.requestCancellation = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        
        const cita = await Appointment.findById(id);
        if (!cita) return res.status(404).json({ message: "Cita no encontrada" });
        
        if (cita.status === 'cancelada') {
            return res.status(400).json({ message: "La cita ya está cancelada" });
        }

        cita.status = 'pendiente_aprobacion';
        cita.cancelacion = {
            solicitadoPor: req.usuario.id, 
            motivo: motivo,
            fechaSolicitud: new Date()
        };
        await cita.save();

        res.json({ message: "Solicitud de cancelación enviada al doctor", cita });
    } catch (error) {
        res.status(500).json({error: "Error en el servidor", message: error});
    }
};

exports.cancelAppointment = async (req,res) => {
    try{
        const { id } = req.params;
        const { role } = req.usuario;
        
        if (role > 2) {
            return res.status(403).json({ msg: 'Acceso denegado' });
        }

        const cita = await Appointment.findById(id);
        if (!cita) {
            return res.status(404).json({ msg: 'Cita no encontrada' });
        }

        if (cita.status !== 'pendiente_aprobacion') {
            return res.status(400).json({ msg: 'Esta cita no tiene una solicitud de cancelación pendiente para aprobación'});
        }

        cita.status = 'cancelada';
        cita.cancelacion.aprobadoPor = req.usuario.id; 
        cita.cancelacion.fechaAprobacion = new Date();

        await cita.save();

        res.json({msg: 'Cancelación hecha con éxito',cita });
    }catch(error){
        res.status(500).json({error: "Error en el servidor",message: error.message});
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
    
        // Obtener todas las citas canceladas
        exports.getCancelAppointments = async (req, res) => {
          try {
            const { role, id: usuarioId } = req.usuario;
            if (!['0', '1', '2', '3'].includes(String(role))) return res.status(403).json({ msg: 'Acceso denegado' });

            const filter = { status: 'cancelada' };
            if (String(role) === '1') filter.medico_id = usuarioId;
            if (String(role) === '3') filter.paciente_id = usuarioId;

            const citas = await Appointment.find(filter)
              .populate('paciente_id', 'username email')
              .populate('medico_id', 'username email')
              .sort({ fecha_hora: 1 });

            return res.status(200).json(citas);
          } catch (error) {
            res.status(500).json({ error: 'Error en el servidor', message: error.message || error });
          }
        };

        // Obtener todas las citas pendientes a confirmar
        exports.getPendingAppointments = async (req, res) => {
          try {
            const { role, id: usuarioId } = req.usuario;
            if (!['0', '1', '2', '3'].includes(String(role))) return res.status(403).json({ msg: 'Acceso denegado' });

            const filter = { status: 'pendiente' };
            if (String(role) === '1') filter.medico_id = usuarioId;
            if (String(role) === '3') filter.paciente_id = usuarioId;

            const citas = await Appointment.find(filter)
              .populate('paciente_id', 'username email')
              .populate('medico_id', 'username email')
              .sort({ fecha_hora: 1 });

            return res.status(200).json(citas);
          } catch (error) {
            res.status(500).json({ error: 'Error en el servidor', message: error.message || error });
          }
        };

        // Obtener todas las citas pendientes de cancelación (si se implementa flag `pendiente_aprobacion` se usará esa)
        exports.getPendingCancellations = async (req, res) => {
          try {
            const { role, id: usuarioId } = req.usuario;
            if (!['0', '1', '2', '3'].includes(String(role))) return res.status(403).json({ msg: 'Acceso denegado' });

            // Preferir la señal `pendiente_aprobacion` si existe en los documentos
            const filterFlag = { status: 'pendiente_aprobacion' };
            if (String(role) === '1') filterFlag.medico_id = usuarioId;
            if (String(role) === '3') filterFlag.paciente_id = usuarioId;

            let citas = await Appointment.find(filterFlag)
              .populate('paciente_id', 'username email')
              .populate('medico_id', 'username email')
              .sort({ fecha_hora: 1 });

            // Fallback a status 'pendiente' si no hay documentos con el flag
            if (!citas || citas.length === 0) {
              const fallback = { status: 'pendiente' };
              if (String(role) === '1') fallback.medico_id = usuarioId;
              if (String(role) === '3') fallback.paciente_id = usuarioId;
              citas = await Appointment.find(fallback)
                .populate('paciente_id', 'username email')
                .populate('medico_id', 'username email')
                .sort({ fecha_hora: 1 });
            }

            return res.status(200).json(citas);
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
}