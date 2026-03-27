//middleware es una conexion intermedia entre el servidor y el usuario
const jwt = require('jsonwebtoken');

module.exports = (req,res, next) =>{
   const token = req.header('Authorization')?.replace('Bearer ', ''); 

   if(!token){
        return res.status(401).json({msg:'No hay token,permiso denegado'});
   }
   try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.usuario = decoded.usuario
          next();
   } catch (error) {
          console.error("DETALLE DEL FALLO:", error.message);
        console.error("Error de JWT:", error.message);
        res.status(401).json({msg:'Token no valido'});
   }

};