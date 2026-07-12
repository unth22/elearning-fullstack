const pool = require("../config/db");

async function getModuleProgress(userId, courseId) {
  const result = await pool.query(
    `SELECT module_index, step_id FROM module_progress WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId]
  );
  return result.rows;
}

async function markStepDone(userId, courseId, moduleIndex, stepId) {
  const result = await pool.query(
    `INSERT INTO module_progress (user_id, course_id, module_index, step_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, course_id, module_index, step_id) DO NOTHING
     RETURNING *`,
    [userId, courseId, moduleIndex, stepId]
  );
  return result.rows[0] || null;
}

module.exports = { getModuleProgress, markStepDone };
