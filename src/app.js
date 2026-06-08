require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const canchasRoutes = require('./routes/canchas.routes');
const reservacionesRoutes = require('./routes/reservaciones.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: CORS_ORIGIN }));


app.get('/api/v1/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// Montar rutas
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/canchas', require('./routes/canchas.routes'));
app.use('/api/v1/reservaciones', reservacionesRoutes);



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});