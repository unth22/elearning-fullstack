const pool = require("../config/db");

async function enroll(userId, courseId, { startLevel, goal } = {}) {
  const result = await pool.query(
    `INSERT INTO enrollments (user_id, course_id, start_level, goal)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, course_id) DO UPDATE
       SET start_level = COALESCE($3, enrollments.start_level),
           goal = COALESCE($4, enrollments.goal)
     RETURNING *`,
    [userId, courseId, startLevel || null, goal || null]
  );
  return result.rows[0];
}

async function getEnrollmentsByUser(userId) {
  const result = await pool.query(
    `SELECT e.*, c.title, c.description, c.icon, c.accent_color, c.name_zh, c.level
     FROM enrollments e JOIN courses c ON c.id = e.course_id
     WHERE e.user_id = $1 ORDER BY e.enrolled_at DESC`,
    [userId]
  );
  return result.rows;
}

async function getLatestEnrollment(userId) {
  const result = await pool.query(
    `SELECT e.*, c.title, c.description, c.icon, c.accent_color, c.name_zh, c.level
     FROM enrollments e JOIN courses c ON c.id = e.course_id
     WHERE e.user_id = $1 ORDER BY e.enrolled_at DESC LIMIT 1`,
    [userId]
  );
  return result.rows[0];
}

async function setGoal(userId, courseId, targetDays) {
  const result = await pool.query(
    `UPDATE enrollments SET target_days = $1, goal_set_at = NOW()
     WHERE user_id = $2 AND course_id = $3 RETURNING *`,
    [targetDays, userId, courseId]
  );
  return result.rows[0];
}

module.exports = { enroll, getEnrollmentsByUser, getLatestEnrollment, setGoal };
