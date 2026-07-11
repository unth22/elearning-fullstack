const pool = require("../config/db");

async function getNotificationsByUser(userId) {
  const result = await pool.query(
    `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

async function createNotification(userId, { type, title, message }) {
  const result = await pool.query(
    `INSERT INTO notifications (user_id, type, title, message)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, type, title, message]
  );
  return result.rows[0];
}

async function markAsRead(id, userId) {
  const result = await pool.query(
    `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
}

async function markAllAsRead(userId) {
  await pool.query(`UPDATE notifications SET is_read = true WHERE user_id = $1`, [userId]);
}

async function hasNotification(userId, type, title) {
  const result = await pool.query(
    `SELECT 1 FROM notifications WHERE user_id = $1 AND type = $2 AND title = $3 LIMIT 1`,
    [userId, type, title]
  );
  return result.rows.length > 0;
}

module.exports = {
  getNotificationsByUser,
  createNotification,
  markAsRead,
  markAllAsRead,
  hasNotification,
};
