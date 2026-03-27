const mongoose = require('mongoose');

const asistenteSchema = new mongoose.Schema({
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
     consultorio: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        required:true
    },
    role: {
    type: String,
    enum: ['0','1', '2', '3'],
    default: '2'
    }
});
module.exports = mongoose.model('Asistentes',asistenteSchema);