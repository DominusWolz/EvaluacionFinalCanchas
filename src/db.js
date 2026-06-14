// src/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Si falta DATABASE_URL, no abortamos; exportamos null para pruebas locales
if (!process.env.DATABASE_URL) {
  console.warn('ADVERTENCIA: DATABASE_URL no definida. Inicialización de BD omitida (modo prueba).');
  module.exports = null;
  return;
}

// DATABASE_URL ejemplo: mysql://user:pass@host:3306/dbname
const connection = mysql.createPool(process.env.DATABASE_URL + '?connectionLimit=10');

module.exports = connection;