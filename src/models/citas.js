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
        enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
        default: 'pendiente'
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