const pool = require("../config/db");

async function getVocabularyByCourseId(courseId) {
  const result = await pool.query(
    `SELECT * FROM vocabulary WHERE course_id = $1 ORDER BY order_index ASC, id ASC`,
    [courseId]
  );
  return result.rows;
}

async function getVocabularyById(id) {
  const result = await pool.query(`SELECT * FROM vocabulary WHERE id = $1`, [id]);
  return result.rows[0];
}

async function createVocabulary({ courseId, zh, pinyin, vi, en, tags, orderIndex }) {
  const result = await pool.query(
    `INSERT INTO vocabulary (course_id, zh, pinyin, vi, en, tags, order_index)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [courseId, zh, pinyin, vi, en, tags || [], orderIndex || 0]
  );
  return result.rows[0];
}

async function updateVocabulary(id, { zh, pinyin, vi, en, tags, orderIndex }) {
  const result = await pool.query(
    `UPDATE vocabulary
     SET zh = COALESCE($1, zh),
         pinyin = COALESCE($2, pinyin),
         vi = COALESCE($3, vi),
         en = COALESCE($4, en),
         tags = COALESCE($5, tags),
         order_index = COALESCE($6, order_index)
     WHERE id = $7 RETURNING *`,
    [zh, pinyin, vi, en, tags, orderIndex, id]
  );
  return result.rows[0];
}

async function deleteVocabulary(id) {
  const result = await pool.query(`DELETE FROM vocabulary WHERE id = $1 RETURNING id`, [id]);
  return result.rows[0];
}

module.exports = {
  getVocabularyByCourseId,
  getVocabularyById,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
};
