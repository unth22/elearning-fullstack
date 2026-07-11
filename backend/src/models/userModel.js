const pool = require("../config/db");

async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

async function createUser({ fullName, email, passwordHash, role = "student" }) {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, full_name, email, role, created_at`,
    [fullName, email, passwordHash, role]
  );
  return result.rows[0];
}

async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, full_name, email, avatar_url, role, created_at FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

async function updateProfile(id, { fullName }) {
  const result = await pool.query(
    `UPDATE users SET full_name = COALESCE($1, full_name)
     WHERE id = $2 RETURNING id, full_name, email, avatar_url, role, created_at`,
    [fullName, id]
  );
  return result.rows[0];
}

async function updateAvatar(id, avatarUrl) {
  const result = await pool.query(
    `UPDATE users SET avatar_url = $1
     WHERE id = $2 RETURNING id, full_name, email, avatar_url, role, created_at`,
    [avatarUrl, id]
  );
  return result.rows[0];
}

async function updatePassword(id, passwordHash) {
  await pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [passwordHash, id]);
}

async function getPasswordHash(id) {
  const result = await pool.query(`SELECT password_hash FROM users WHERE id = $1`, [id]);
  return result.rows[0]?.password_hash;
}

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  updateProfile,
  updateAvatar,
  updatePassword,
  getPasswordHash,
};
