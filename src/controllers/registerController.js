const Medico = require("../models/medico");
const Paciente = require("../models/paciente");
const Asistente = require("../models/asistente");
const Admin = require("../models/admin");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerPaciente = async (req,res) => {
    try {
        const{username,email,password} =req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: 'Por favor, ingresa un correo electrónico válido'});
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ msg: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'});
        }

        const usuario = await Paciente.findOne({email});

         if(usuario){
        return res.status(409).json({msg:'El usuario ya existe'})
        } 
        const salt = await bcrypt.genSalt(10); // 10 caracteres random (uh24@%rtT1)
        const newPassword = await bcrypt.hash(password,salt);//hash= convierte datos en una cadena unica(tiene que ver con un texto), 
        // salt =(cosas aleatorias) hace que sea mas dificil descifrar, descompone la contraseña y la añade al hash
        const nuevoPaciente = new Paciente({
            username,
            email,
            password: newPassword,
            role:3
        });
        await nuevoPaciente.save();
        res.status(201).json(nuevoPaciente);
    }catch (error) {
       res.status(500).json({error: "Error: Crea un usuario", message: error}); 
    }
    
}
exports.registerPersonal = async (req, res) => {
    try {
        
        if (!req.usuario || req.usuario.role !== 0) {
            return res.status(403).json({ msg: "Acceso denegado. Solo el administrador puede realizar esta acción" });
        }

        const { username, password, email, role, especialidad, cedulaInterna,consultorio } = req.body;

         if (!email.toLowerCase().endsWith("@hospitalhealth.com")) {
            return res.status(400).json({ msg: "El correo debe pertenecer al dominio concretado" });
        }

         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ msg: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'});
        }

        if (![1, 2].includes(role)) {
            return res.status(400).json({ msg: "Rol no válido"});
        }

        const existeMedico = await Medico.findOne({ email });
        const existeAsistente = await Asistente.findOne({ email });
        
        if (existeMedico || existeAsistente) {
            return res.status(409).json({ msg: "El correo ya está registrado en el sistema"});
        }

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        let nuevoUsuario;

        if (role === 1) {
            const regexCedula = /^[0-9]{3}$/;
            if (!regexCedula.test(cedulaInterna)) {
                return res.status(400).json({ msg: "Cédula inválida"});
            }
            
            const cedulaDuplicada = await Medico.findOne({ cedulaInterna });
            if (cedulaDuplicada) return res.status(409).json({ msg: "Cédula ya registrada" });

            nuevoUsuario = new Medico({
                username, 
                email, 
                password: newPassword,
                especialidad, 
                cedulaInterna, 
                role: 1
            });
        } else {
            nuevoUsuario = new Asistente({
                username,
                email, 
                password: newPassword,
                consultorio, 
                role: 2
            });
        }

        await nuevoUsuario.save();
        res.status(201).json({msg: `${role === 1 ? 'Médico' : 'Asistente'} registrado`,usuario: nuevoUsuario.username});

    } catch (error) {
        res.status(500).json({error: "Error en el servidor", message: error});
    }
}
exports.registerAdmin = async (req, res) => {
    try {
        const { username, email, password, adminSecret } = req.body;

        if (!email.toLowerCase().endsWith("@healthtrack.com")) {
            return res.status(400).json({ msg: "El correo debe pertenecer al dominio concretado" });
        }

         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ msg: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'});
        }

        if (adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
            return res.status(403).json({ msg: "Codigo de verificacion incorrecto"});
        }

        const existeAdmin = await Admin.findOne({ email: email });
        if (existeAdmin) return res.status(409).json({ msg: "El usuario ya existe" });

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        const jefe = new Admin({
            username,
            email, 
            password: newPassword,
            role: 0,
            especialidad: "Dirección"
        });

        await jefe.save();
        res.status(201).json({ msg: "Creado exitosamente" });

    } catch (error) {
        res.status(500).json({error: "Error en el servidor", message: error});
    }
}