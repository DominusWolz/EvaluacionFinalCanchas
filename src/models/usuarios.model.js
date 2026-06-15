// src/models/usuarios.model.js
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

async function updatePassword(idUsuario, hashedPassword) {
  const [result] = await db.query('UPDATE Usuario SET contrasena = ? WHERE idUsuario = ?', [hashedPassword, idUsuario]);
  return result.affectedRows;
}

// nuevo: actualizar campos (nombre, email, telefono)
async function updateById(id, fieldsObj) {
  const fields = [];
  const values = [];
  if (fieldsObj.nombre !== undefined) { fields.push('nombre = ?'); values.push(fieldsObj.nombre); }
  if (fieldsObj.email !== undefined) { fields.push('email = ?'); values.push(fieldsObj.email); }
  if (fieldsObj.telefono !== undefined) { fields.push('telefono = ?'); values.push(fieldsObj.telefono); }
  if (fieldsObj.contrasena !== undefined) { fields.push('contrasena = ?'); values.push(fieldsObj.contrasena); } // hashed expected
  if (fields.length === 0) return 0;
  const sql = `UPDATE Usuario SET ${fields.join(', ')} WHERE idUsuario = ?`;
  values.push(id);
  const [result] = await db.query(sql, values);
  return result.affectedRows;
}

// nuevo: eliminar usuario (hard delete)
async function removeById(id) {
  const [result] = await db.query('DELETE FROM Usuario WHERE idUsuario = ?', [id]);
  return result.affectedRows;
}

module.exports = { getAll, getById, getByEmail, create, updatePassword, updateById, removeById };