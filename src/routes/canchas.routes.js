// src/routes/canchas.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/canchas.controller');
const authenticate = require('../middlewares/authenticate');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', controller.list);
router.get('/:id', controller.getById);

router.post('/', authenticate, isAdmin, controller.create);
router.put('/:id', authenticate, isAdmin, controller.update);
router.delete('/:id', authenticate, isAdmin, controller.remove);

module.exports = router;