// src/controllers/canchas.controller.js
const Canchas = require('../models/canchas.model');
const Joi = require('joi');

// esquema de validación
const canchaSchema = Joi.object({
  nombreCancha: Joi.string().trim().min(2).max(120).required().messages({
    'string.empty': 'nombreCancha es obligatorio',
    'any.required': 'nombreCancha es obligatorio',
    'string.min': 'nombreCancha debe tener al menos 2 caracteres',
    'string.max': 'nombreCancha debe tener como máximo 120 caracteres'
  }),
  deporte: Joi.string().trim().max(50).optional().allow(''),
  descripcion: Joi.string().max(500).optional().allow(''),
  precioHora: Joi.number().min(0).precision(2).required().messages({
    'number.base': 'precioHora debe ser numérico',
    'number.min': 'precioHora debe ser mayor o igual a 0',
    'any.required': 'precioHora es obligatorio'
  }),
  Estado: Joi.string().valid('Disponible','Reservada','Inactivo').optional().allow(null,'')
});

async function list(req, res) {
  try {
    const rows = await Canchas.getAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function getById(req, res) {
  try {
    const cancha = await Canchas.getById(req.params.id);
    if (!cancha) return res.status(404).json({ error: true, message: 'Cancha no encontrada' });
    res.json(cancha);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function create(req, res) {
  // validar entrada
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
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: true,
        message: 'Nombre de cancha ya existe',
        errors: { nombreCancha: 'Ya existe una cancha con ese nombre' }
      });
    }
    return res.status(500).json({ error: true, message: 'Error interno' });
  }
}

// src/controllers/canchas.controller.js (solo las funciones update y remove)
async function update(req, res) {
  const id = req.params.id;
  // validar entrada parcial: permitir sólo los campos presentes
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
    if (!affected) return res.status(404).json({ error: true, message: 'Cancha no encontrada' });
    return res.json({ error: false, message: 'Cancha actualizada' });
  } catch (err) {
    console.error('canchas.update error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: true,
        message: 'Nombre de cancha ya existe',
        errors: { nombreCancha: 'Ya existe una cancha con ese nombre' }
      });
    }
    const detail = err.sqlMessage || err.message || String(err);
    return res.status(500).json({ error: true, message: 'Error interno', detail });
  }
}

async function remove(req, res) {
  console.log('DELETE /api/v1/canchas/:id - params:', req.params, 'user:', req.user);
  const id = req.params.id;
  try {
    const affected = await Canchas.removeById(id);
    if (!affected) return res.status(404).json({ error: true, message: 'Cancha no encontrada' });
    return res.json({ mensaje: 'Cancha eliminada' });
  } catch (err) {
    console.error('canchas.remove error:', err);
    const detail = err.sqlMessage || err.message || String(err);
    return res.status(500).json({ error: true, message: 'Error interno', detail });
  }
}
module.exports = { list, getById, create, update, remove };