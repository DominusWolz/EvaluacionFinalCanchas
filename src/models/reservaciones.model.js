// src/models/reservaciones.model.js
const db = require('../db');

async function getAll() {
  const [rows] = await db.query('SELECT * FROM Reservaciones');
  return rows;
}

async function getById(id) {
  const [rows] = await db.query('SELECT * FROM Reservaciones WHERE idReserva = ?', [id]);
  return rows[0];
}

async function getByUser(idUsuario) {
  const [rows] = await db.query('SELECT * FROM Reservaciones WHERE idUsuario = ? ORDER BY inicio DESC', [idUsuario]);
  return rows;
}

async function create({ idUsuario, idCancha, inicio, fin, precio_total }) {
  const query = 'INSERT INTO Reservaciones (idUsuario, idCancha, inicio, fin, precio_total) VALUES (?, ?, ?, ?, ?)';
  const [result] = await db.query(query, [idUsuario, idCancha, inicio, fin, precio_total]);
  return result.insertId;
}

async function updateById(id, { inicio, fin, estado, precio_total }) {
  const fields = [];
  const values = [];
  if (inicio !== undefined) { fields.push('inicio = ?'); values.push(inicio); }
  if (fin !== undefined) { fields.push('fin = ?'); values.push(fin); }
  if (estado !== undefined) { fields.push('estado = ?'); values.push(estado); }
  if (precio_total !== undefined) { fields.push('precio_total = ?'); values.push(precio_total); }
  if (fields.length === 0) return 0;
  const sql = `UPDATE Reservaciones SET ${fields.join(', ')} WHERE idReserva = ?`;
  values.push(id);
  const [result] = await db.query(sql, values);
  return result.affectedRows;
}

async function removeById(id) {
  const [result] = await db.query('DELETE FROM Reservaciones WHERE idReserva = ?', [id]);
  return result.affectedRows;
}

module.exports = { getAll, getById, getByUser, create, updateById, removeById };
