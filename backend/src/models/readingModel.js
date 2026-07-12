const pool = require("../config/db");

async function getPassagesByCourseId(courseId) {
  const result = await pool.query(
    `SELECT * FROM reading_passages WHERE course_id = $1 ORDER BY module_index ASC NULLS LAST, id ASC`,
    [courseId]
  );
  return result.rows;
}

async function getQuestionsByCourseId(courseId) {
  const result = await pool.query(
    `SELECT * FROM comprehension_questions WHERE course_id = $1 ORDER BY module_index ASC NULLS LAST, order_index ASC, id ASC`,
    [courseId]
  );
  return result.rows;
}

module.exports = { getPassagesByCourseId, getQuestionsByCourseId };
