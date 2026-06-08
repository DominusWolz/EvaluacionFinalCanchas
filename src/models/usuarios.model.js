const db = require('../db');

async function getAll() {
  const [rows] = await db.query('SELECT idUsuario, nombre, email, telefono, fechCreacion, fechModificacion FROM Usuario');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT idUsuario, nombre, email, telefono, fechCreacion, fechModificacion FROM Usuario WHERE idUsuario = ?', [id]);
  return rows[0];
}

async function getByEmail(email) {
  const [rows] = await db.query('SELECT * FROM Usuario WHERE email = ?', [email]);
  return rows[0];
}

async function create({ nombre, email, contrasena, telefono }) {
  const [result] = await db.query(
    'INSERT INTO Usuario (nombre, email, contrasena, telefono) VALUES (?, ?, ?, ?)',
    [nombre, email, contrasena, telefono || null]
  );
  const id = result.insertId;
  return getById(id);
}

module.exports = { getAll, getById, getByEmail, create };