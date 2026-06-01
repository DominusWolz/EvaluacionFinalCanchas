const Usuarios = require('../models/usuarios.model');

async function list(req, res) {
  try {
    const rows = await Usuarios.getAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

async function getById(req, res) {
  try {
    const usuario = await Usuarios.getById(req.params.id);
    if (!usuario) return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error interno' });
  }
}

module.exports = { list, getById };