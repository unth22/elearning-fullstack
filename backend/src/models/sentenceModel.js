const pool = require("../config/db");

async function getSentencesByCourseId(courseId) {
  const result = await pool.query(
    `SELECT * FROM example_sentences WHERE course_id = $1 ORDER BY order_index ASC, id ASC`,
    [courseId]
  );
  return result.rows;
}

async function getSentenceById(id) {
  const result = await pool.query(`SELECT * FROM example_sentences WHERE id = $1`, [id]);
  return result.rows[0];
}

async function createSentence({ courseId, zh, pinyin, vi, orderIndex }) {
  const result = await pool.query(
    `INSERT INTO example_sentences (course_id, zh, pinyin, vi, order_index)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [courseId, zh, pinyin, vi, orderIndex || 0]
  );
  return result.rows[0];
}

async function updateSentence(id, { zh, pinyin, vi, orderIndex }) {
  const result = await pool.query(
    `UPDATE example_sentences
     SET zh = COALESCE($1, zh),
         pinyin = COALESCE($2, pinyin),
         vi = COALESCE($3, vi),
         order_index = COALESCE($4, order_index)
     WHERE id = $5 RETURNING *`,
    [zh, pinyin, vi, orderIndex, id]
  );
  return result.rows[0];
}

async function deleteSentence(id) {
  const result = await pool.query(`DELETE FROM example_sentences WHERE id = $1 RETURNING id`, [id]);
  return result.rows[0];
}

module.exports = {
  getSentencesByCourseId,
  getSentenceById,
  createSentence,
  updateSentence,
  deleteSentence,
};
