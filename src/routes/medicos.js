const express = require("express");
const router = express.Router();


const medicosController = require("../controllers/medicosController");

/**
 * @swagger
 * /api/medicos/getAllMedicos:
 *   get:
 *     summary: Obtener todos los médicos
 *     tags:
 *       - Medicos
 *     responses:
 *       200:
 *         description: Lista de médicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   especialidad:
 *                     type: string
 *                   email:
 *                     type: string
 *             example:
 *               - username: "Dr. García"
 *                 especialidad: "Cardiología"
 *                 email: "dr.garcia@hospitalhealth.com"
 */
router.get('/getAllMedicos', medicosController.getAllMedicos);

module.exports = router;
