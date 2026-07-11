const pool = require("../config/db");

async function getAllPublishedCourses() {
  const result = await pool.query(
    `SELECT id, title, description, industry, cover_url, icon, accent_color, name_zh, level, created_at
     FROM courses WHERE is_published = true ORDER BY sort_order ASC, created_at DESC`
  );
  return result.rows;
}

async function getAllCoursesForAdmin() {
  const result = await pool.query(`SELECT * FROM courses ORDER BY created_at DESC`);
  return result.rows;
}

async function getCourseById(id) {
  const result = await pool.query(`SELECT * FROM courses WHERE id = $1`, [id]);
  return result.rows[0];
}

async function createCourse({ title, description, industry, coverUrl, createdBy, icon, accentColor, nameZh, level }) {
  const result = await pool.query(
    `INSERT INTO courses (title, description, industry, cover_url, created_by, icon, accent_color, name_zh, level)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [title, description, industry, coverUrl, createdBy, icon, accentColor, nameZh, level]
  );
  return result.rows[0];
}

async function updateCourse(id, { title, description, industry, coverUrl, isPublished, icon, accentColor, nameZh, level }) {
  const result = await pool.query(
    `UPDATE courses
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         industry = COALESCE($3, industry),
         cover_url = COALESCE($4, cover_url),
         is_published = COALESCE($5, is_published),
         icon = COALESCE($6, icon),
         accent_color = COALESCE($7, accent_color),
         name_zh = COALESCE($8, name_zh),
         level = COALESCE($9, level)
     WHERE id = $10 RETURNING *`,
    [title, description, industry, coverUrl, isPublished, icon, accentColor, nameZh, level, id]
  );
  return result.rows[0];
}

async function deleteCourse(id) {
  const result = await pool.query(`DELETE FROM courses WHERE id = $1 RETURNING id`, [id]);
  return result.rows[0];
}

module.exports = {
  getAllPublishedCourses,
  getAllCoursesForAdmin,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
