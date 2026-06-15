// src/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const { DATABASE_URL, DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

if (DATABASE_URL) {
  // Si se proporciona DATABASE_URL, la usamos tal cual
  const pool = mysql.createPool(DATABASE_URL + '?connectionLimit=10');
  module.exports = pool;
  return;
}

// Fallback: construir DSN desde variables individuales (útil en dev)
if (DB_HOST && DB_USER && DB_NAME) {
  const port = DB_PORT || 3306;
  const dsn = `mysql://${DB_USER}:${DB_PASS || ''}@${DB_HOST}:${port}/${DB_NAME}`;
  const pool = mysql.createPool(dsn + '?connectionLimit=10');
  module.exports = pool;
  return;
}

// Si no hay configuración, exportamos un objeto que lanza errores claros al usarlo
console.warn('ADVERTENCIA: No se encontró configuración de BD (DATABASE_URL o DB_HOST/DB_USER/DB_NAME).');
module.exports = {
  query: async () => { throw new Error('DB no configurada. Define DATABASE_URL o DB_HOST/DB_USER/DB_NAME en .env'); }
};