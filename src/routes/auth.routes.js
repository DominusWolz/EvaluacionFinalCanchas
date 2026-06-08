const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const authController = require('../controllers/auth.controller');

router.post('/register', usuariosController.register);
router.post('/login', authController.login);

module.exports = router;