const express = require("express"); //permitir sacar las apis al exterior
const router = express.Router();

const auth = require("../middlewares/auth");
const createAppointmentsController = require("../controllers/appointmentsController");


router.post("/createAppointments",auth,createAppointmentsController.createAppointments);
router.patch("/updateAppointmentStatus/:id",auth,createAppointmentsController.updateAppointmentStatus);
router.patch("/requestCancellation/:id",auth,createAppointmentsController.requestCancellation);
router.patch("/cancelAppointment/:id",auth,createAppointmentsController.cancelAppointment);
router.get('/getAllAppointments', auth, createAppointmentsController.getAllAppointments);
router.get('/getSpecificAppointments/:id', auth, createAppointmentsController.getSpecificAppointments);
router.get('/getCancelAppointments', auth, createAppointmentsController.getCancelAppointments);
router.get('/getPendingAppointments', auth, createAppointmentsController.getPendingAppointments);
router.get('/getPendingCancellations', auth, createAppointmentsController.getPendingCancellations);


module.exports = router;