const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
    paciente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pacientes',
        required: true
    },
    medico_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicos', 
        required: true
    },
    fecha_hora: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pendiente', 'confirmada','pendiente_aprobacion','cancelada', 'completada'],
        default: 'pendiente'
    },
    cancelacion: {
        solicitadoPor: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Usuarios' 
        },
        motivo: { type: String },
        fechaSolicitud: { type: Date },
        aprobadoPor: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Usuarios' 
        },
        fechaAprobacion: { type: Date }
    },
    motivo: {
        type: String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Citas',citaSchema);