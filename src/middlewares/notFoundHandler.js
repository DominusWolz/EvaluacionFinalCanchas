// src/middlewares/notFoundHandler.js
module.exports = function notFoundHandler(req, res) {
  res.status(404).json({
    error: true,
    message: 'Resource not found',
    code: 'NOT_FOUND'
  });
};