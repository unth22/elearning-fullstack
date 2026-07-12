const pool = require("../config/db");

async function getDialogueByCourseId(courseId) {
  const result = await pool.query(
    `SELECT * FROM dialogue_lines WHERE course_id = $1 ORDER BY module_index ASC NULLS LAST, dialogue_group ASC, order_index ASC, id ASC`,
    [courseId]
  );
  return result.rows;
}

module.exports = { getDialogueByCourseId };
