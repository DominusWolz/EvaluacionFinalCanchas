// routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');

// Registro por POST /api/v1/usuarios (opcional)
router.post('/', controller.register);

router.get('/', controller.list);
router.get('/:id', controller.getById);

module.exports = router;