const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique: true
    },
    email: {
        type: String,
        required:true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
    type: String,
    enum: ['0','1', '2', '3'],
    default: '3'
    }
});
module.exports = mongoose.model('Pacientes',pacienteSchema);