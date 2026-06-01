const db = require('../db');

async function getAll() {
  const [rows] = await db.query('SELECT idUsuario, nombre, email, telefono, fechCreacion, fechModificacion FROM Usuario');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT idUsuario, nombre, email, telefono, fechCreacion, fechModificacion FROM Usuario WHERE idUsuario = ?', [id]);
  return rows[0];
}

module.exports = { getAll, getById };