// src/controllers/canchas.controller.js
const Canchas = require('../models/canchas.model');
const Joi = require('joi');

const canchaSchema = Joi.object({
  nombreCancha: Joi.string().trim().min(2).max(120).required().messages({
    'string.empty': 'El nombre de la cancha es obligatorio',
    'any.required': 'El nombre de la cancha es obligatorio',
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre es demasiado largo'
  }),
  deporte: Joi.string().trim().max(50).optional().allow(''),
  descripcion: Joi.string().max(500).optional().allow(''),
  precioHora: Joi.number().min(0).precision(2).required().messages({
    'number.base': 'Ingresa un precio válido (solo números)',
    'number.min': 'El precio no puede ser negativo',
    'any.required': 'El precio por hora es obligatorio'
  }),
  Estado: Joi.string().valid('Disponible','Reservada','Inactivo').optional().allow(null,'')
});

async function list(req, res, next) {
  try {
    const rows = await Canchas.getAll();
    res.json(rows);
  } catch (err) {
    next(err); // Se va al errorHandler central
  }
}

async function getById(req, res, next) {
  try {
    const cancha = await Canchas.getById(req.params.id);
    if (!cancha) return res.status(404).json({ error: true, message: 'Cancha no encontrada', code: 'NOT_FOUND' });
    res.json(cancha);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  const { error, value } = canchaSchema.validate(req.body, { abortEarly: false, convert: true });
  if (error) {
    const errors = {};
    error.details.forEach(d => {
      const key = d.path[0] || 'general';
      errors[key] = d.message;
    });
    return res.status(422).json({ error: true, message: 'Validación falló', errors });
  }

  const { nombreCancha, deporte, descripcion, precioHora, Estado } = value;
  try {
    const id = await Canchas.create({
      nombreCancha,
      deporte: deporte || 'Futbol',
      descripcion,
      precioHora: precioHora || 0.00,
      Estado: Estado || 'Disponible'
    });
    return res.status(201).json({ error: false, message: 'Cancha creada', id });
  } catch (err) {
    // Si hay un duplicado (ER_DUP_ENTRY), el middleware lo transforma en 409
    // y tu frontend CanchasCrud.jsx (línea 116) lo mapeará a 'nombreCancha'
    next(err); 
  }
}

async function update(req, res, next) {
  const id = req.params.id;
  const partialSchema = canchaSchema.fork(Object.keys(canchaSchema.describe().keys), (s) => s.optional());
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
    const affected = await Canchas.updateById(id, value);
    if (!affected) return res.status(404).json({ error: true, message: 'Cancha no encontrada', code: 'NOT_FOUND' });
    return res.json({ error: false, message: 'Cancha actualizada' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  const id = req.params.id;
  try {
    const affected = await Canchas.removeById(id);
    if (!affected) return res.status(404).json({ error: true, message: 'Cancha no encontrada', code: 'NOT_FOUND' });
    return res.json({ mensaje: 'Cancha eliminada' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };