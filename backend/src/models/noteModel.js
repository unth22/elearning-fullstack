const pool = require("../config/db");

async function getNotesByUserAndCourse(userId, courseId) {
  const result = await pool.query(
    `SELECT * FROM student_notes WHERE user_id = $1 AND course_id = $2 ORDER BY created_at DESC`,
    [userId, courseId]
  );
  return result.rows;
}

async function createNote(userId, { courseId, selectedText, note, color }) {
  const result = await pool.query(
    `INSERT INTO student_notes (user_id, course_id, selected_text, note, color)
     VALUES ($1, $2, $3, $4, COALESCE($5, 'yellow')) RETURNING *`,
    [userId, courseId, selectedText, note || null, color]
  );
  return result.rows[0];
}

async function updateNote(id, userId, { note, color }) {
  const result = await pool.query(
    `UPDATE student_notes
     SET note = COALESCE($1, note), color = COALESCE($2, color)
     WHERE id = $3 AND user_id = $4 RETURNING *`,
    [note, color, id, userId]
  );
  return result.rows[0];
}

async function deleteNote(id, userId) {
  const result = await pool.query(
    `DELETE FROM student_notes WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, userId]
  );
  return result.rows[0];
}

module.exports = { getNotesByUserAndCourse, createNote, updateNote, deleteNote };
