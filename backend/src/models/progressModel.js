const pool = require("../config/db");

async function getProgressForCourse(userId, courseId) {
  const result = await pool.query(
    `SELECT l.id AS lesson_id, l.title, l.order_index, l.duration_seconds,
            COALESCE(p.is_completed, false) AS is_completed,
            p.completed_at
     FROM lessons l
     LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = $1
     WHERE l.course_id = $2
     ORDER BY l.order_index ASC`,
    [userId, courseId]
  );
  return result.rows;
}

async function setLessonProgress(userId, lessonId, isCompleted) {
  const result = await pool.query(
    `INSERT INTO progress (user_id, lesson_id, is_completed, completed_at)
     VALUES ($1, $2, $3, CASE WHEN $3 THEN NOW() ELSE NULL END)
     ON CONFLICT (user_id, lesson_id) DO UPDATE
       SET is_completed = $3,
           completed_at = CASE WHEN $3 THEN NOW() ELSE NULL END,
           updated_at = NOW()
     RETURNING *`,
    [userId, lessonId, isCompleted]
  );
  return result.rows[0];
}

module.exports = { getProgressForCourse, setLessonProgress };
