const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: ['0','1', '2', '3'],
        default: 0 
    },
    especialidad: {
        type: String,
        enum: ['Dirección','Direccion'],
        required: true
    }
    
});

module.exports = mongoose.model('Admin', adminSchema);