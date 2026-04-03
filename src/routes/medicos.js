const express = require("express");
const router = express.Router();


const medicosController = require("../controllers/medicosController");

router.get('/getAllMedicos', medicosController.getAllMedicos);

module.exports = router;
