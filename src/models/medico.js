const mongoose = require('mongoose');

const especialidadesValidas = {
    values: ['Cardiología', 'Pediatría', 'Reumatología', 'General', 'Ginecología', 'Jefe'],
    message: '{VALUE} no es una especialidad válida' 
};
const medicoSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true,
        unique: true
    },
    especialidad: {
        type: String,
        required: true,
        enum: especialidadesValidas
    },
    cedulaInterna: {
    type: String,
    unique: true 
    },
    role: {
    type: String,
    enum: ['0','1', '2', '3'],
    default: '1'
    }
});
module.exports = mongoose.model('Medicos',medicoSchema);