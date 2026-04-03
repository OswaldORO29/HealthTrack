const express = require("express"); //permitir sacar las apis al exterior
const router = express.Router();

const auth = require("../middlewares/auth");
const createAppointmentsController = require("../controllers/appointmentsController");


router.post("/createAppointments",auth,createAppointmentsController.createAppointments);
router.patch("/updateAppointmentStatus/:id",auth,createAppointmentsController.updateAppointmentStatus);
router.patch("/requestCancellation/:id",auth,createAppointmentsController.requestCancellation);
router.patch("/cancelAppointment/:id",auth,createAppointmentsController.cancelAppointment);
router.get('/getAllAppointments', auth, (req, res, next) => require('../controllers/appointmentsController').getAllAppointments(req, res, next));
router.get('/getSpecificAppointments/:id', auth, (req, res, next) => require('../controllers/appointmentsController').getSpecificAppointments(req, res, next));
router.get('/getCancelAppointments', auth, (req, res, next) => require('../controllers/appointmentsController').getCancelAppointments(req, res, next));
router.get('/getPendingAppointments', auth, (req, res, next) => require('../controllers/appointmentsController').getPendingAppointments(req, res, next));
router.get('/getPendingCancellations', auth, (req, res, next) => require('../controllers/appointmentsController').getPendingCancellations(req, res, next));


module.exports = router;