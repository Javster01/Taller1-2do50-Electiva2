const express = require('express');
const router = express.Router();

// Importar los controladores de autenticación
const { createUsuario, login } = require('../controllers/controll-Auth');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre completo del usuario
 *                 example: Jairo Riaño
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: jairo.riano@uptc.edu.co
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: clave1234
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID del usuario creado
 *       400:
 *         description: Datos inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Faltan campos requeridos"
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión para obtener un token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico registrado
 *                 example: jairo.riano@uptc.edu.co
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: clave1234
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGFlYjQ2NzVkZGMwZGE2ZmZkYzcwNSIsImlhdCI6MTcyOTIwNzk1MCwiZXhwIjoxNzI5ODEyNzUwfQ.TRZwv7L4Nu2qnH1k7XSG8V2yyk9aPwW0Q9plv494CHw
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Correo o contraseña incorrectos"
 *       500:
 *         description: Error interno del servidor
 */

// Rutas públicas para autenticación
router.post('/users', createUsuario); // Registro de usuarios
router.post('/login', login); // Inicio de sesión

module.exports = router;
