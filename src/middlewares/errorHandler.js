// src/middlewares/errorHandler.js
module.exports = function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === 'production';

  let status = err.status || 500;
  let code = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'Error interno del servidor';

  // 1. Mapeo de errores nativos de MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    status = 409;
    code = 'CONFLICT_ERROR';
    message = 'El registro ya existe o hay un conflicto de datos';
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    status = 400;
    code = 'FOREIGN_KEY_CONSTRAINT';
    message = 'Error de referencia: El recurso asociado no existe';
  } else if (err.code === 'ER_BAD_NULL_ERROR') {
    status = 422;
    code = 'VALIDATION_ERROR';
    message = 'Faltan campos obligatorios en la base de datos';
  }

  // 2. Mapeo de tu error personalizado de Trigger/Procedimiento (Horario no disponible)
  if (err.sqlMessage?.includes('horario no disponible') || err.message?.includes('horario no disponible')) {
    status = 409;
    code = 'SCHEDULE_CONFLICT';
    message = 'Horario no disponible';
  }

  // Construcción de la respuesta JSON coherente
  const payload = {
    error: true,
    message: (status === 500 && isProd) ? 'Internal server error' : message,
    code: (status === 500 && isProd) ? 'INTERNAL_ERROR' : code
  };

  // En desarrollo, mostramos la traza para facilitar el debug
  if (!isProd) {
    payload.devMessage = err.message;
    if (err.sqlMessage) payload.sqlMessage = err.sqlMessage; // Útil para ver el error real de MySQL
    payload.stack = err.stack;
  } else {
    // En producción, solo registramos en consola (o archivo log) el error real, sin exponerlo al cliente
    console.error(`[Error ${status}]: ${err.message}`);
  }

  res.status(status).json(payload);
};