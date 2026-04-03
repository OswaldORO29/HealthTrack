require('dotenv').config();
//tools
const express = require('express');// expone todo el aplicativo
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./src/config/database');// para entrar ./
const registerRoutes = require('./src/routes/register');
const loginRoutes = require("./src/routes/login");
const appointmentsRoutes = require("./src/routes/appointments");
const medicosRoutes = require("./src/routes/medicos");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());// comunicacion

// Swagger 
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Health Track',
      version: '1.0.0',
      description: 'Documentación Health Track',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Paciente: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'integer' }
          },
          example: {
            username: 'Juan Perez',
            email: 'juan@example.com',
            password: 'Contraseña123',
            role: 3
          }
        },
        RegisterPersonal: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'integer' },
            especialidad: { type: 'string' },
            cedulaInterna: { type: 'string' },
            consultorio: { type: 'string' }
          },
          example: {
            username: 'Dr. García',
            email: 'dr.garcia@hospitalhealth.com',
            password: 'Doctor1234',
            role: 1,
            especialidad: 'Cardiología',
            cedulaInterna: '123',
            consultorio: 'A-12'
          }
        },
        AdminRegister: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            adminSecret: { type: 'string' }
          },
          example: {
            username: 'Admin',
            email: 'admin@healthtrack.com',
            password: 'AdminPass123',
            adminSecret: 'SECRETCODE'
          }
        },
        Login: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' }
          },
          example: {
            email: 'usuario@ejemplo.com',
            password: 'Contraseña123'
          }
        }
      }
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-healthTrack', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//main routes

app.use('/api/appointments', appointmentsRoutes);
app.use("/api/register", registerRoutes);
app.use("/api", loginRoutes);
app.use("/api/medicos", medicosRoutes);

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