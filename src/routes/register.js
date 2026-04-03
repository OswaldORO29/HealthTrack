const express = require("express"); //permitir sacar las apis al exterior
const router = express.Router();

const registerController = require("../controllers/registerController");
const auth = require("../middlewares/auth");


/**
 * @swagger
 * /api/register/paciente:
 *   post:
 *     summary: Registrar paciente
 *     tags:
 *       - Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       201:
 *         description: Paciente registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 */
router.post("/paciente",registerController.registerPaciente);


/**
 * @swagger
 * /api/register/admin:
 *   post:
 *     summary: Registrar admin
 *     tags:
 *       - Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminRegister'
 *     responses:
 *       201:
 *         description: Admin registrado
 */
router.post("/admin",registerController.registerAdmin);


/**
 * @swagger
 * /api/register/personal:
 *   post:
 *     summary: Registrar personal (requiere auth)
 *     tags:
 *       - Register
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterPersonal'
 *     responses:
 *       201:
 *         description: Personal registrado
 */
router.post("/personal",auth,registerController.registerPersonal);

module.exports = router;