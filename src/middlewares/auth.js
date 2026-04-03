//middleware es una conexion intermedia entre el servidor y el usuario
const jwt = require('jsonwebtoken');

module.exports = (req,res, next) =>{
   // Log temporal para depuración: muestra el header Authorization recibido
   const authHeader = req.header('Authorization');
   console.log('DEBUG auth - headers.Authorization:', authHeader);

   if (!authHeader) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' });
   }

   const parts = authHeader.split(' ');
   if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ msg: 'Formato de token inválido. Use: Authorization: Bearer <token>' });
   }

   const token = parts[1];
   if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' });
   }

   try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded.usuario;
        next();
   } catch (error) {
        console.error('DETALLE DEL FALLO:', error.message);
        res.status(401).json({ msg: 'Token no valido' });
   }

};