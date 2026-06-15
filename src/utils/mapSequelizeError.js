const { ValidationError, UniqueConstraintError, DatabaseError } = require('sequelize');

function mapSequelizeError(err) {
  if (err instanceof ValidationError) {
    return {
      status: 422,
      code: 'VALIDATION_ERROR',
      message: err.errors.map(e => e.message).join('; '),
      details: err.errors.map(e => ({ path: e.path, message: e.message }))
    };
  }

  if (err instanceof UniqueConstraintError) {
    return {
      status: 409,
      code: 'UNIQUE_CONSTRAINT',
      message: err.errors.map(e => e.message).join('; '),
      details: err.errors.map(e => ({ path: e.path, message: e.message }))
    };
  }

  if (err instanceof DatabaseError) {
    return {
      status: 400,
      code: 'DATABASE_ERROR',
      message: err.message,
      details: null
    };
  }

  return null;
}

module.exports = mapSequelizeError;