// src/controllers/usuarios.controller.js
const Usuarios = require('../models/usuarios.model');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// schema para update parcial
const updateSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(120).optional(),
  email: Joi.string().email().optional(),
  telefono: Joi.string().allow('', null).optional(),
  contrasena: Joi.string().min(8).optional()
});

function isRaichu(req) {
  const adminEmail = 'pikachu234@gmail.com';
  return req.user && req.user.email === adminEmail;
}

async function list(req, res) {
  try {
    const rows = await Usuarios.getAll();
    res.json(rows);
  } catch (err) {
    console.error('usuarios.list error', err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await Usuarios.getById(id);
    if (!user) return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error('usuarios.getById error', err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    // permiso: propietario o Raichu
    const requesterId = req.user?.userId;
    if (!requesterId) return res.status(401).json({ error: true, message: 'No autenticado' });
    if (requesterId !== id && !isRaichu(req)) {
      return res.status(403).json({ error: true, message: 'No autorizado' });
    }

    const { error, value } = updateSchema.validate(req.body, { abortEarly: false, convert: true });
    if (error) {
      const errors = {};
      error.details.forEach(d => { errors[d.path[0]] = d.message; });
      return res.status(422).json({ error: true, message: 'Validación falló', errors });
    }

    // si cambia email, verificar duplicado
    if (value.email) {
      const existing = await Usuarios.getByEmail(value.email);
      if (existing && existing.idUsuario !== id) {
        return res.status(409).json({ error: true, message: 'Email ya en uso', errors: { email: 'Email ya en uso' } });
      }
    }

    // si cambia contraseña, hashearla
    if (value.contrasena) {
      const hashed = await bcrypt.hash(value.contrasena, SALT_ROUNDS);
      value.contrasena = hashed;
    }

    const affected = await Usuarios.updateById(id, value);
    if (!affected) return res.status(404).json({ error: true, message: 'Usuario no encontrado o nada que actualizar' });

    return res.json({ error: false, message: 'Usuario actualizado' });
  } catch (err) {
    console.error('usuarios.update error', err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const requesterId = req.user?.userId;
    if (!requesterId) return res.status(401).json({ error: true, message: 'No autenticado' });
    if (requesterId !== id && !isRaichu(req)) {
      return res.status(403).json({ error: true, message: 'No autorizado' });
    }

    const affected = await Usuarios.removeById(id);
    if (!affected) return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    return res.json({ error: false, message: 'Usuario eliminado' });
  } catch (err) {
    console.error('usuarios.remove error', err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

module.exports = { list, getById, update, remove };