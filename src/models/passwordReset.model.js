const db = require('../db');
const crypto = require('crypto');

async function create({ user_id, token_hash, expires_at }) {
  const [result] = await db.query(
    'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [user_id, token_hash, expires_at]
  );
  return result.insertId;
}

async function findValidByHash(token_hash) {
  const [rows] = await db.query(
    'SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used = 0 AND expires_at > NOW()',
    [token_hash]
  );
  return rows[0];
}

async function markUsed(id) {
  const [result] = await db.query('UPDATE password_reset_tokens SET used = 1 WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { create, findValidByHash, markUsed };