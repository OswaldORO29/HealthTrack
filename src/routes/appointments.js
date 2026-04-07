const express = require("express"); //permitir sacar las apis al exterior
const router = express.Router();

const auth = require("../middlewares/auth");
const appointmentsController = require("../controllers/appointmentsController");



/**
 * @swagger
 * /api/appointments/createAppointments:
 *   post:
 *     summary: Crear una nueva cita
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *               pacienteId:
 *                 type: string
 *           example:
 *             fecha: "2026-04-03T10:00:00Z"
 *             pacienteId: "642f1e8b9a1c2b3d4e5f6a7b"
 *     responses:
 *       201:
 *         description: Cita creada correctamente
 */
router.post("/createAppointments",auth,appointmentsController.createAppointments);


/**
 * @swagger
 * /api/appointments/updateAppointmentStatus/{id}:
 *   patch:
 *     summary: Actualizar estado de la cita
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *           example:
 *             status: "cancelled"
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch("/updateAppointmentStatus/:id",auth,appointmentsController.updateAppointmentStatus);


/**
 * @swagger
 * /api/appointments/requestCancellation/{id}:
 *   patch:
 *     summary: Solicitar cancelación de cita
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motivo:
 *                 type: string
 *           example:
 *             motivo: "Paciente pide anular por enfermedad"
 *     responses:
 *       200:
 *         description: Solicitud enviada
 */
router.patch("/requestCancellation/:id",auth,appointmentsController.requestCancellation);


/**
 * @swagger
 * /api/appointments/cancelAppointment/{id}:
 *   patch:
 *     summary: Cancelar una cita
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cita cancelada
 */
router.patch("/cancelAppointment/:id",auth,appointmentsController.cancelAppointment);


/**
 * @swagger
 * /api/appointments/getAllAppointments:
 *   get:
 *     summary: Obtener todas las citas
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   fecha:
 *                     type: string
 *                   pacienteId:
 *                     type: string
 *                   status:
 *                     type: string
 *             example:
 *               - _id: "642f1e8b9a1c2b3d4e5f6a7b"
 *                 fecha: "2026-04-03T10:00:00Z"
 *                 pacienteId: "5f6a7b8c9d0e1f2a3b4c5d6e"
 *                 status: "confirmed"
 */
router.get('/getAllAppointments', auth, (req, res, next) => require('../controllers/appointmentsController').getAllAppointments(req, res, next));


/**
 * @swagger
 * /api/appointments/getSpecificAppointments/{id}:
 *   get:
 *     summary: Obtener cita específica
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle de la cita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fecha:
 *                   type: string
 *                 pacienteId:
 *                   type: string
 *                 status:
 *                   type: string
 *             example:
 *               _id: "642f1e8b9a1c2b3d4e5f6a7b"
 *               fecha: "2026-04-03T10:00:00Z"
 *               pacienteId: "5f6a7b8c9d0e1f2a3b4c5d6e"
 *               status: "confirmed"
 */
router.get('/getSpecificAppointments/:id', auth, (req, res, next) => require('../controllers/appointmentsController').getSpecificAppointments(req, res, next));


/**
 * @swagger
 * /api/appointments/getCancelAppointments:
 *   get:
 *     summary: Obtener citas canceladas
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Citas canceladas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "642f1e8b9a1c2b3d4e5f6a7b"
 *                 fecha: "2026-04-03T10:00:00Z"
 *                 status: "cancelled"
 */
router.get('/getCancelAppointments', auth, (req, res, next) => require('../controllers/appointmentsController').getCancelAppointments(req, res, next));


/**
 * @swagger
 * /api/appointments/getPendingAppointments:
 *   get:
 *     summary: Obtener citas pendientes
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Citas pendientes
 */
router.get('/getPendingAppointments', auth, (req, res, next) => require('../controllers/appointmentsController').getPendingAppointments(req, res, next));


/**
 * @swagger
 * /api/appointments/getPendingCancellations:
 *   get:
 *     summary: Obtener solicitudes de cancelación pendientes
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solicitudes pendientes
 */
router.get('/getPendingCancellations', auth, (req, res, next) => require('../controllers/appointmentsController').getPendingCancellations(req, res, next));


/**
 * @swagger
 * /api/appointments/updateAppointments/{id}:
 *   put:
 *     summary: Actualizar campos de una cita (paciente, médico, fecha, estado, motivo)
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paciente_id:
 *                 type: string
 *               medico_id:
 *                 type: string
 *               fecha_hora:
 *                 type: string
 *               status:
 *                 type: string
 *               motivo:
 *                 type: string
 *           example:
 *             paciente_id: "642f1e8b9a1c2b3d4e5f6a7b"
 *             medico_id: "5f6a7b8c9d0e1f2a3b4c5d6e"
 *             fecha_hora: "2026-04-04T12:00:00Z"
 *             status: "confirmada"
 *             motivo: "Cambio de horario"
 *     responses:
 *       200:
 *         description: Cita actualizada
 */
router.put('/updateAppointments/:id', auth, appointmentsController.updateAppointments);


module.exports = router;