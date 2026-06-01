const mysql = require('mysql2/promise');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('Falta DATABASE_URL en .env');
  process.exit(1);
}

// DATABASE_URL ejemplo: mysql://user:pass@host:3306/dbname
const connection = mysql.createPool(process.env.DATABASE_URL + '?connectionLimit=10');

module.exports = connection;