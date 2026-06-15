// src/controllers/auth.controller.js
const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const PasswordReset = require('../models/passwordReset.model');
const Joi = require('joi');

const JWT_SECRET = process.env.JWT_SECRET || 'REEMPLAZAR_POR_SECRETO';
const JWT_EXPIRES_IN = '8h';
const SALT_ROUNDS = 10;

const RESET_TOKEN_BYTES = parseInt(process.env.RESET_TOKEN_BYTES || '32', 10);
const RESET_TOKEN_EXP = process.env.RESET_TOKEN_EXP || '30m';
const parseResetMinutes = (v) => {
  if (!v) return 30;
  if (typeof v === 'number') return v;
  if (v.endsWith('m')) return parseInt(v.slice(0, -1), 10);
  if (v.endsWith('h')) return parseInt(v.slice(0, -1), 10) * 60;
  return 30;
};
const RESET_EXP_MINUTES = parseResetMinutes(RESET_TOKEN_EXP);

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

// Validation schema for register
const registerSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().email().required(),
  contrasena: Joi.string().min(8).required(),
  telefono: Joi.string().allow('', null)
});

async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false, convert: true });
    if (error) {
      const errors = {};
      error.details.forEach(d => { errors[d.path[0]] = d.message; });
      return res.status(422).json({ error: true, message: 'Validación falló', errors });
    }

    const { nombre, email, contrasena, telefono } = value;

    // comprobar si email ya existe
    const existing = await Usuarios.getByEmail(email);
    if (existing) {
      return res.status(409).json({ error: true, message: 'Email ya registrado', errors: { email: 'Email ya en uso' } });
    }

    // hashear contraseña
    const hashed = await bcrypt.hash(contrasena, SALT_ROUNDS);

    // crear usuario (Usuarios.create devuelve el usuario sin contraseña según tu modelo)
    const user = await Usuarios.create({ nombre, email, contrasena: hashed, telefono });

    // devolver sin contrasena
    return res.status(201).json({
      error: false,
      message: 'Usuario creado',
      user: { idUsuario: user.idUsuario, nombre: user.nombre, email: user.email, telefono: user.telefono }
    });
  } catch (err) {
    console.error('auth.register error', err);
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, contrasena } = req.body;
    if (!email || !contrasena) {
      return next({ status: 400, message: 'Faltan email o contrasena', code: 'BAD_REQUEST' });
    }

    const user = await Usuarios.getByEmail(email);
    if (!user) {
      return next({ status: 401, message: 'Credenciales inválidas', code: 'UNAUTHORIZED' });
    }

    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) {
      return next({ status: 401, message: 'Credenciales inválidas', code: 'UNAUTHORIZED' });
    }

    // incluir email y nombre en el payload para que req.user tenga esos campos
    const payload = { userId: user.idUsuario, email: user.email, nombre: user.nombre };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      error: false,
      token,
      user: { idUsuario: user.idUsuario, nombre: user.nombre, email: user.email, telefono: user.telefono }
    });
  } catch (err) {
    return next(err);
  }
}

// Forgot / Reset ya los tienes; los dejamos igual (si quieres los integro aquí, ya están en tu archivo)
async function forgot(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return next({ status: 400, message: 'Email es requerido', code: 'BAD_REQUEST' });

    const user = await Usuarios.getByEmail(email);

    const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex');
    const tokenHash = sha256(token);
    const expiresAt = new Date(Date.now() + RESET_EXP_MINUTES * 60 * 1000);

    if (user) {
      await PasswordReset.create({ user_id: user.idUsuario, token_hash: tokenHash, expires_at: expiresAt });
    }

    const devToken = (process.env.NODE_ENV !== 'production') ? token : undefined;

    const resp = { error: false, message: 'Si existe una cuenta asociada, recibirás instrucciones para restablecer la contraseña' };
    if (devToken) resp.devToken = devToken;

    if (process.env.NODE_ENV !== 'production') {
      console.log('PASSWORD RESET token for', email, '->', token, 'expires in', RESET_EXP_MINUTES, 'minutes');
    }

    return res.json(resp);
  } catch (err) {
    return next(err);
  }
}

async function reset(req, res, next) {
  try {
    const { token, password } = req.body;
    if (!token || !password) return next({ status: 400, message: 'Token y nueva contraseña son requeridos', code: 'BAD_REQUEST' });

    if (typeof password !== 'string' || password.length < 8) {
      return next({ status: 400, message: 'La contraseña debe tener al menos 8 caracteres', code: 'BAD_REQUEST' });
    }

    const tokenHash = sha256(token);
    const record = await PasswordReset.findValidByHash(tokenHash);
    if (!record) return next({ status: 400, message: 'Token inválido o expirado', code: 'INVALID_TOKEN' });

    const user = await Usuarios.getById(record.user_id);
    if (!user) return next({ status: 404, message: 'Usuario no encontrado', code: 'USER_NOT_FOUND' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    await Usuarios.updatePassword(user.idUsuario, hashed);

    await PasswordReset.markUsed(record.id);

    return res.json({ error: false, message: 'Contraseña restablecida. Ya puedes iniciar sesión con la nueva contraseña.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, forgot, reset };