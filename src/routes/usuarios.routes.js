const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');
const authenticate = require('../middlewares/authenticate');

// Listar usuarios (puedes protegerlo si quieres)
router.get('/', authenticate, controller.list);

// Obtener perfil por id
router.get('/:id', authenticate, controller.getById);

// Actualizar (propietario o Raichu)
router.put('/:id', authenticate, controller.update);

// Eliminar (propietario o Raichu)
router.delete('/:id', authenticate, controller.remove);

module.exports = router;