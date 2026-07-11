const pool = require("../config/db");

async function getGrammarByCourseId(courseId) {
  const result = await pool.query(
    `SELECT * FROM grammar_patterns WHERE course_id = $1 ORDER BY order_index ASC, id ASC`,
    [courseId]
  );
  return result.rows;
}

async function getGrammarById(id) {
  const result = await pool.query(`SELECT * FROM grammar_patterns WHERE id = $1`, [id]);
  return result.rows[0];
}

async function createGrammar({ courseId, pattern, exampleZh, exampleVi, orderIndex }) {
  const result = await pool.query(
    `INSERT INTO grammar_patterns (course_id, pattern, example_zh, example_vi, order_index)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [courseId, pattern, exampleZh, exampleVi, orderIndex || 0]
  );
  return result.rows[0];
}

async function updateGrammar(id, { pattern, exampleZh, exampleVi, orderIndex }) {
  const result = await pool.query(
    `UPDATE grammar_patterns
     SET pattern = COALESCE($1, pattern),
         example_zh = COALESCE($2, example_zh),
         example_vi = COALESCE($3, example_vi),
         order_index = COALESCE($4, order_index)
     WHERE id = $5 RETURNING *`,
    [pattern, exampleZh, exampleVi, orderIndex, id]
  );
  return result.rows[0];
}

async function deleteGrammar(id) {
  const result = await pool.query(`DELETE FROM grammar_patterns WHERE id = $1 RETURNING id`, [id]);
  return result.rows[0];
}

module.exports = {
  getGrammarByCourseId,
  getGrammarById,
  createGrammar,
  updateGrammar,
  deleteGrammar,
};
