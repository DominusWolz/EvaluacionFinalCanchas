const express = require('express');
const router = express.Router();
const controller = require('../controllers/canchas.controller');
const authenticate = require('../middlewares/authenticate');

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.remove);

module.exports = router;