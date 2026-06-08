// src/controllers/auth.controller.js
const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'REEMPLAZAR_POR_SECRETO';
const JWT_EXPIRES_IN = '8h';

async function login(req, res) {
  try {
    const { email, contrasena } = req.body;
    if (!email || !contrasena) {
      return res.status(400).json({ error: true, message: 'Faltan email o contrasena' });
    }

    const user = await Usuarios.getByEmail(email);
    if (!user) {
      return res.status(401).json({ error: true, message: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) {
      return res.status(401).json({ error: true, message: 'Credenciales inválidas' });
    }

    const payload = { userId: user.idUsuario };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      error: false,
      token,
      user: { idUsuario: user.idUsuario, nombre: user.nombre, email: user.email }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: 'Error interno' });
  }
}

module.exports = { login };