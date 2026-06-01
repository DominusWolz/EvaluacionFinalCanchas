const express = require('express');
const router = express.Router();
const controller = require('../controllers/canchas.controller');

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', controller.create);

module.exports = router;