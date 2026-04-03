require('dotenv').config();
//tools
const express = require('express');// expone todo el aplicativo
const connectDB = require('./src/config/database');// para entrar ./
const registerRoutes = require('./src/routes/register');
const loginRoutes = require("./src/routes/login");
const appointmentsRoutes = require("./src/routes/appointments");
const medicosRoutes = require("./src/routes/medicos");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());// comunicacion

//main routes

app.use('/api/appointments', appointmentsRoutes);
app.use("/api/register", registerRoutes);
app.use("/api", loginRoutes);
<<<<<<< HEAD
app.use('/api/auth', loginRoutes);
app.use('/api/auth/register', registerRoutes);
app.use('/api/medicos', medicosRoutes);
// appointments routes already mounted above
=======
>>>>>>> 1cec272e4b9d8f6d84ca1a3f6baf2bb14a05d5de

//Connection to connectBD
connectDB();
/*const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Health Track',
      version: '1.0.0',
      description: 'Documentación Health Track',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./index.js','./src/routes/auth.js','./src/routes/reportes.js'],
};*/

/*const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-healthTrack', swaggerUi.serve, swaggerUi.setup(swaggerDocs));*/

app.listen(PORT, () =>{
    console.log(`Port connection running in: http://localhost:${PORT}`);
    //console.log(`Documentación disponible en http://localhost:${PORT}/api-healthTrack`);
});