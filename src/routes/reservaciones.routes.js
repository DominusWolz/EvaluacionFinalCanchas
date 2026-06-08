// src/routes/reservaciones.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservaciones.controller');
const authenticate = require('../middlewares/authenticate');

// Todas las rutas de reservaciones protegidas
router.get('/', authenticate, controller.list);
router.get('/:id', authenticate, controller.getById);
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.remove);

module.exports = router;