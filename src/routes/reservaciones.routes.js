const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservaciones.controller');
const authenticate = require('../middlewares/authenticate');


router.get('/', authenticate, controller.list);

module.exports = router;