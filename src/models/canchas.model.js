const db = require('../db');

async function getAll() {
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
  return result.insertId;
}

module.exports = { getAll, getById, create };