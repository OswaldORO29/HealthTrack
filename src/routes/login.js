const express = require("express"); //permitir sacar las apis al exterior
const router = express.Router();

const loginController = require("../controllers/loginController");


router.post("/login",loginController.login);

module.exports = router;