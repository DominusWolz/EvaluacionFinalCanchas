// src/middlewares/authenticate.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'REEMPLAZAR_POR_SECRETO';

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, message: 'Token no provisto' });
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { userId: ... }
    return next();
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Token inválido o expirado' });
  }
}

module.exports = authenticate;