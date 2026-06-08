// src/controllers/canchas.controller.js
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

// src/controllers/canchas.controller.js (solo las funciones update y remove)
async function update(req, res) {
  console.log('PUT /api/v1/canchas/:id - params:', req.params, 'body:', req.body, 'user:', req.user);
  const id = req.params.id;
  const { nombreCancha, deporte, descripcion, precioHora, Estado } = req.body;
  try {
    const affected = await Canchas.updateById(id, { nombreCancha, deporte, descripcion, precioHora, Estado });
    if (!affected) return res.status(404).json({ error: true, message: 'Cancha no encontrada' });
    return res.json({ mensaje: 'Cancha actualizada' });
  } catch (err) {
    console.error('canchas.update error:', err);
    // devolver detalles útiles para depuración (temporal)
    const detail = err.sqlMessage || err.message || String(err);
    return res.status(500).json({ error: true, message: 'Error interno', detail });
  }
}

async function remove(req, res) {
  console.log('DELETE /api/v1/canchas/:id - params:', req.params, 'user:', req.user);
  const id = req.params.id;
  try {
    const affected = await Canchas.removeById(id);
    if (!affected) return res.status(404).json({ error: true, message: 'Cancha no encontrada' });
    return res.json({ mensaje: 'Cancha eliminada' });
  } catch (err) {
    console.error('canchas.remove error:', err);
    const detail = err.sqlMessage || err.message || String(err);
    return res.status(500).json({ error: true, message: 'Error interno', detail });
  }
}
module.exports = { list, getById, create, update, remove };