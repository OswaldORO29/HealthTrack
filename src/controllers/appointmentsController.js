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
}