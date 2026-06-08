const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

async function list(req, res) {
  try {
    const rows = await Usuarios.getAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function getById(req, res) {
  try {
    const usuario = await Usuarios.getById(req.params.id);
    if (!usuario) return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function register(req, res) {
  try {
    const { nombre, email, contrasena, telefono } = req.body;

    if (!email || !contrasena || !nombre) {
      return res.status(400).json({ error: true, message: 'Faltan campos obligatorios: nombre, email, contrasena' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: true, message: 'Email inválido' });
    }

    if (contrasena.length < 6) {
      return res.status(400).json({ error: true, message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existing = await Usuarios.getByEmail(email);
    if (existing) {
      return res.status(409).json({ error: true, message: 'El email ya está registrado' });
    }

    const hashed = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const created = await Usuarios.create({ nombre, email, contrasena: hashed, telefono });

    const { contrasena: _, ...safeUser } = created;

    return res.status(201).json({ error: false, message: 'Usuario creado', user: safeUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: 'Error interno' });
  }
}

module.exports = { list, getById, register };