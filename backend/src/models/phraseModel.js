const pool = require("../config/db");

async function getPhrasesByCourseId(courseId) {
  const result = await pool.query(
    `SELECT * FROM phrases WHERE course_id = $1 ORDER BY order_index ASC, id ASC`,
    [courseId]
  );
  return result.rows;
}

module.exports = { getPhrasesByCourseId };
