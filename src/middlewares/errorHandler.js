// src/middlewares/errorHandler.js
module.exports = function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === 'production';
  const status = err && err.status ? err.status : 500;
  const code = err && err.code ? err.code : (status === 500 ? 'INTERNAL_ERROR' : 'ERROR');
  const message = (status === 500 && isProd) ? 'Internal server error' : (err && err.message) || 'Error';

  const payload = { error: true, message, code };

  if (!isProd) {
    payload.devMessage = err && err.message;
    payload.stack = err && err.stack;
    if (err && err.details) payload.details = err.details;
    if (err && err.errors) payload.errors = err.errors; // <-- mantener errores si vienen
  } else {
    // en producción, si el error ya trae 'errors' (validación/conflicto), incluirlo también
    if (err && err.errors) payload.errors = err.errors;
  }

  console.error(err);
  res.status(status).json(payload);
};