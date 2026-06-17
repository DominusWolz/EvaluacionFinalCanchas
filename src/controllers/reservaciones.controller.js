// src/controllers/reservaciones.controller.js
const Reservaciones = require('../models/reservaciones.model');
const Joi = require('joi');

// Esquema de validación para las reservaciones
const reservaSchema = Joi.object({
  idCancha: Joi.number().integer().required().messages({
    'any.required': 'La cancha es obligatoria',
    'number.base': 'El ID de la cancha debe ser numérico'
  }),
  inicio: Joi.date().iso().required().messages({
    'any.required': 'La fecha y hora de inicio son obligatorias',
    'date.format': 'Formato de fecha de inicio inválido'
  }),
  // Regla de negocio: la fecha de fin debe ser estrictamente posterior a la de inicio
  fin: Joi.date().iso().greater(Joi.ref('inicio')).required().messages({
    'any.required': 'La fecha y hora de fin son obligatorias',
    'date.greater': 'La hora de fin debe ser posterior a la hora de inicio',
    'date.format': 'Formato de fecha de fin inválido'
  }),
  precio_total: Joi.number().min(0).precision(2).optional().allow(null, '').messages({
    'number.min': 'El precio no puede ser negativo'
  }),
  estado: Joi.string().valid('Pendiente', 'Confirmada', 'Cancelada').optional().allow(null, '')
});

async function list(req, res, next) {
  try {
    const userId = req.user?.userId;
    // Capturamos los filtros de la URL (rq-07)
    const { fecha, idCancha, mine } = req.query; 

    let rows = [];

    // Si pide solo sus reservas
    if (mine === 'true' && userId) {
      rows = await Reservaciones.getByUser(userId);
    } else {
      rows = await Reservaciones.getAll();
    }

    // Aplicar filtros en memoria (para no complicar el modelo SQL a última hora)
    if (fecha) {
      // Filtramos las reservas que empiecen en esa fecha
      rows = rows.filter(r => r.inicio && r.inicio.startsWith(fecha));
    }
    if (idCancha) {
      rows = rows.filter(r => String(r.idCancha) === String(idCancha));
    }

    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const reserva = await Reservaciones.getById(req.params.id);
    if (!reserva) return res.status(404).json({ error: true, message: 'Reservación no encontrada', code: 'NOT_FOUND' });
    
    if (req.user && reserva.idUsuario !== req.user.userId) {
      return res.status(403).json({ error: true, message: 'No autorizado', code: 'FORBIDDEN' });
    }
    res.json(reserva);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  // Validación de entrada con Joi antes de ir a la BD
  const { error, value } = reservaSchema.validate(req.body, { abortEarly: false, convert: true });
  
  if (error) {
    const errors = {};
    error.details.forEach(d => {
      const key = d.path[0] || 'general';
      errors[key] = d.message;
    });
    return res.status(422).json({ error: true, message: 'Validación falló', errors });
  }

  const idUsuario = req.user?.userId || req.body.idUsuario;
  if (!idUsuario) {
    return res.status(401).json({ error: true, message: 'Usuario no identificado', code: 'UNAUTHORIZED' });
  }

  const { idCancha, inicio, fin, precio_total } = value;
  
  try {
    const id = await Reservaciones.create({ 
      idUsuario, 
      idCancha, 
      inicio, 
      fin, 
      precio_total: precio_total || 0.00 
    });
    res.status(201).json({ error: false, message: 'Reservación creada con éxito', id });
  } catch (err) {
    next(err); // El errorHandler atrapará el error de "horario no disponible" y dará 409
  }
}

async function update(req, res, next) {
  const id = req.params.id;
  
  // Validación parcial (permite actualizar solo algunos campos)
  const partialSchema = reservaSchema.fork(Object.keys(reservaSchema.describe().keys), (s) => s.optional());
  const { error, value } = partialSchema.validate(req.body, { abortEarly: false, convert: true });
  
  if (error) {
    const errors = {};
    error.details.forEach(d => {
      const key = d.path[0] || 'general';
      errors[key] = d.message;
    });
    return res.status(422).json({ error: true, message: 'Validación falló', errors });
  }

  try {
    const reserva = await Reservaciones.getById(id);
    if (!reserva) return res.status(404).json({ error: true, message: 'Reservación no encontrada', code: 'NOT_FOUND' });
    if (req.user && reserva.idUsuario !== req.user.userId) return res.status(403).json({ error: true, message: 'No autorizado', code: 'FORBIDDEN' });
    
    const affected = await Reservaciones.updateById(id, value);
    if (!affected) return res.status(400).json({ error: true, message: 'Nada que actualizar', code: 'BAD_REQUEST' });
    
    res.json({ error: false, message: 'Reservación actualizada' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  const id = req.params.id;
  try {
    const reserva = await Reservaciones.getById(id);
    if (!reserva) return res.status(404).json({ error: true, message: 'Reservación no encontrada', code: 'NOT_FOUND' });
    if (req.user && reserva.idUsuario !== req.user.userId) return res.status(403).json({ error: true, message: 'No autorizado', code: 'FORBIDDEN' });
    
    const affected = await Reservaciones.removeById(id);
    if (!affected) return res.status(404).json({ error: true, message: 'Reservación no encontrada', code: 'NOT_FOUND' });
    
    res.json({ error: false, message: 'Reservación eliminada' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };