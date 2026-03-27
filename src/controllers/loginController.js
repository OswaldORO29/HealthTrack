const Paciente = require("../models/paciente");
const Medico = require("../models/medico");
const Asistente = require("../models/asistente");
const Admin = require("../models/admin");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

exports.login = async (req,res) => {
    try {
        const {email,password} = req.body;
        let usuario = await Paciente.findOne({email});

        if (!usuario) {
            usuario = await Medico.findOne({email});
        }

        if (!usuario) {
            usuario = await Asistente.findOne({email});
        }
        if (!usuario) {
            usuario = await Admin.findOne({email});
        }
        if (!usuario) {
            return res.status(401).json({ msg: 'El usuario no existe. Credencial inválida' });
        }
        
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) return res.status(400).json({msg:'La contraseña no es correcta.Credencial invalida'});

        const payload = {
            usuario:{
                id: usuario.id,
                email: usuario.email,
                role: usuario.role,   
                username: usuario.username 
            }
        }
        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' },
            (err,token) =>{ 
            if(err) throw err;
            res.json({token});
        });

    } catch (error) {
        res.status(500).json({error: "Error en el servidor", message: error}); 
    }
}
