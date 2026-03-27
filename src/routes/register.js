const express = require("express"); //permitir sacar las apis al exterior
const router = express.Router();

const registerController = require("../controllers/registerController");
const auth = require("../middlewares/auth");


router.post("/paciente",registerController.registerPaciente);
router.post("/admin",registerController.registerAdmin);
router.post("/personal",auth,registerController.registerPersonal);

module.exports = router;