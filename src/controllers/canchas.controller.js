const Canchas = require('../models/canchas.model');

async function list(req, res) {
  try {
    const rows = await Canchas.getAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function getById(req, res) {
  try {
    const cancha = await Canchas.getById(req.params.id);
    if (!cancha) return res.status(404).json({ error: true, message: 'Cancha no encontrada' });
    res.json(cancha);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function create(req, res) {
  const { nombreCancha, deporte, descripcion, precioHora, Estado } = req.body;
  if (!nombreCancha) return res.status(400).json({ error: true, message: 'nombreCancha es obligatorio' });
  try {
    const id = await Canchas.create({ nombreCancha, deporte: deporte || 'Futbol', descripcion, precioHora: precioHora || 0.00, Estado: Estado || 'Disponible' });
    res.status(201).json({ mensaje: 'Cancha creada', id });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: true, message: 'Nombre de cancha ya existe' });
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

module.exports = { list, getById, create };