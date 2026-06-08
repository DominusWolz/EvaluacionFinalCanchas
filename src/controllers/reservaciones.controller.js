// src/controllers/reservaciones.controller.js
const Reservaciones = require('../models/reservaciones.model');

async function list(req, res) {
  try {
    // Si query ?mine=true o no, por defecto lista todas si admin; aquí listamos solo del usuario si existe req.user
    const userId = req.user?.userId;
    if (userId) {
      const rows = await Reservaciones.getByUser(userId);
      return res.json(rows);
    }
    const rows = await Reservaciones.getAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function getById(req, res) {
  try {
    const reserva = await Reservaciones.getById(req.params.id);
    if (!reserva) return res.status(404).json({ error: true, message: 'Reservación no encontrada' });
    // opcional: verificar que el usuario es dueño
    if (req.user && reserva.idUsuario !== req.user.userId) {
      return res.status(403).json({ error: true, message: 'No autorizado' });
    }
    res.json(reserva);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function create(req, res) {
  const idUsuario = req.user?.userId || req.body.idUsuario;
  const { idCancha, inicio, fin, precio_total } = req.body;
  if (!idUsuario || !idCancha || !inicio || !fin) return res.status(400).json({ error: true, message: 'idUsuario, idCancha, inicio y fin son obligatorios' });
  try {
    const id = await Reservaciones.create({ idUsuario, idCancha, inicio, fin, precio_total: precio_total || 0.00 });
    res.status(201).json({ mensaje: 'Reservación creada', id });
  } catch (err) {
    console.error(err);
    if ((err.sqlMessage && err.sqlMessage.includes('horario no disponible')) || (err.message && err.message.includes('horario no disponible'))) {
      return res.status(409).json({ error: true, message: 'Horario no disponible' });
    }
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function update(req, res) {
  const id = req.params.id;
  const { inicio, fin, estado, precio_total } = req.body;
  try {
    const reserva = await Reservaciones.getById(id);
    if (!reserva) return res.status(404).json({ error: true, message: 'Reservación no encontrada' });
    if (req.user && reserva.idUsuario !== req.user.userId) return res.status(403).json({ error: true, message: 'No autorizado' });
    const affected = await Reservaciones.updateById(id, { inicio, fin, estado, precio_total });
    if (!affected) return res.status(400).json({ error: true, message: 'Nada que actualizar' });
    res.json({ mensaje: 'Reservación actualizada' });
  } catch (err) {
    console.error(err);
    if ((err.sqlMessage && err.sqlMessage.includes('horario no disponible')) || (err.message && err.message.includes('horario no disponible'))) {
      return res.status(409).json({ error: true, message: 'Horario no disponible' });
    }
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function remove(req, res) {
  const id = req.params.id;
  try {
    const reserva = await Reservaciones.getById(id);
    if (!reserva) return res.status(404).json({ error: true, message: 'Reservación no encontrada' });
    if (req.user && reserva.idUsuario !== req.user.userId) return res.status(403).json({ error: true, message: 'No autorizado' });
    const affected = await Reservaciones.removeById(id);
    if (!affected) return res.status(404).json({ error: true, message: 'Reservación no encontrada' });
    res.json({ mensaje: 'Reservación eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

module.exports = { list, getById, create, update, remove };