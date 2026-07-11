const pool = require("../config/db");

async function getLessonsByCourseId(courseId) {
  const result = await pool.query(
    `SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index ASC`,
    [courseId]
  );
  return result.rows;
}

async function getLessonById(id) {
  const result = await pool.query(`SELECT * FROM lessons WHERE id = $1`, [id]);
  return result.rows[0];
}

async function createLesson({ courseId, title, videoUrl, durationSeconds, orderIndex }) {
  const result = await pool.query(
    `INSERT INTO lessons (course_id, title, video_url, duration_seconds, order_index)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [courseId, title, videoUrl, durationSeconds, orderIndex]
  );
  return result.rows[0];
}

async function updateLesson(id, { title, videoUrl, durationSeconds, orderIndex }) {
  const result = await pool.query(
    `UPDATE lessons
     SET title = COALESCE($1, title),
         video_url = COALESCE($2, video_url),
         duration_seconds = COALESCE($3, duration_seconds),
         order_index = COALESCE($4, order_index)
     WHERE id = $5 RETURNING *`,
    [title, videoUrl, durationSeconds, orderIndex, id]
  );
  return result.rows[0];
}

async function deleteLesson(id) {
  const result = await pool.query(`DELETE FROM lessons WHERE id = $1 RETURNING id`, [id]);
  return result.rows[0];
}

module.exports = {
  getLessonsByCourseId,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
