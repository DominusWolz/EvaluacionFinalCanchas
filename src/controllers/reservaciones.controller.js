const Reservaciones = require('../models/reservaciones.model');

async function list(req, res) {
  try {
    const rows = await Reservaciones.getAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function create(req, res) {
  const { idUsuario, idCancha, inicio, fin, precio_total } = req.body;
  if (!idUsuario || !idCancha || !inicio || !fin) return res.status(400).json({ error: true, message: 'idUsuario, idCancha, inicio y fin son obligatorios' });
  try {
    const id = await Reservaciones.create({ idUsuario, idCancha, inicio, fin, precio_total: precio_total || 0.00 });
    res.status(201).json({ mensaje: 'Reservación creada', id });
  } catch (err) {
    console.error(err);
    if (err.sqlMessage && err.sqlMessage.includes('horario no disponible')) return res.status(409).json({ error: true, message: 'Horario no disponible' });
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

module.exports = { list, create};