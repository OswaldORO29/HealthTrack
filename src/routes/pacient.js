const express = require("express");
const router = express.Router();


const pacientController = require("../controllers/pacientcontroller");

/**
 * @swagger
 * /api/pacientes/getAllPacientes:
 *   get:
 *     summary: Obtener todos los pacientes
 *     tags:
 *       - Pacientes
 *     responses:
 *       200:
 *         description: Lista de pacientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *             example:
 *               - username: "Juan Perez"
 *                 id: "64b8c9f1e4b0a2d5f8a9c123"
 *                 email: "juan.perez@example.com"
 */
router.get("/getAllPacientes", pacientController.getAllPacientes);

module.exports = router;