const db = require('../db');

async function getAll() {
  const [rows] = await db.query('SELECT * FROM Reservaciones');
  return rows;
}

async function create({ idUsuario, idCancha, inicio, fin, precio_total }) {
  const query = 'INSERT INTO Reservaciones (idUsuario, idCancha, inicio, fin, precio_total) VALUES (?, ?, ?, ?, ?)';
  const [result] = await db.query(query, [idUsuario, idCancha, inicio, fin, precio_total]);
  return result.insertId;
}

async function removeById(id) {
  const [result] = await db.query('DELETE FROM Reservaciones WHERE idReserva = ?', [id]);
  return result.affectedRows;
}

module.exports = { getAll, create, removeById };