// src/models/canchas.model.js
const db = require('../db');

async function getAll() {
  // Retornamos TODAS las canchas (incluyendo las inactivas)
  // para que el Administrador pueda verlas en el CRUD y reactivarlas.
  const [rows] = await db.query('SELECT * FROM Canchas');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM Canchas WHERE idCancha = ?', [id]);
  return rows[0];
}

async function create({ nombreCancha, deporte, descripcion, precioHora, Estado }) {
  const query = 'INSERT INTO Canchas (nombreCancha, deporte, descripcion, precioHora, Estado) VALUES (?, ?, ?, ?, ?)';
  const [result] = await db.query(query, [nombreCancha, deporte, descripcion, precioHora, Estado]);
  // devolver el id insertado para consistencia con el controlador actual
  return result.insertId;
}

async function updateById(id, { nombreCancha, deporte, descripcion, precioHora, Estado }) {
  const fields = [];
  const values = [];
  if (nombreCancha !== undefined) { fields.push('nombreCancha = ?'); values.push(nombreCancha); }
  if (deporte !== undefined) { fields.push('deporte = ?'); values.push(deporte); }
  if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }
  if (precioHora !== undefined) { fields.push('precioHora = ?'); values.push(precioHora); }
  if (Estado !== undefined) { fields.push('Estado = ?'); values.push(Estado); }
  if (fields.length === 0) return 0;
  const sql = `UPDATE Canchas SET ${fields.join(', ')} WHERE idCancha = ?`;
  values.push(id);
  const [result] = await db.query(sql, values);
  return result.affectedRows;
}

async function removeById(id) {
  // Eliminación lógica: marcar Estado = 'Inactivo'
  const [result] = await db.query('UPDATE Canchas SET Estado = ? WHERE idCancha = ?', ['Inactivo', id]);
  return result.affectedRows;
}

module.exports = { getAll, getById, create, updateById, removeById };