const pool = require("../config/db");

async function getDueCards(userId, courseId) {
  const result = await pool.query(
    `SELECT v.* FROM vocabulary v
     LEFT JOIN srs_state s ON s.vocabulary_id = v.id AND s.user_id = $1
     WHERE v.course_id = $2 AND (s.next_review IS NULL OR s.next_review <= NOW())
     ORDER BY v.order_index ASC`,
    [userId, courseId]
  );
  return result.rows;
}

async function getState(userId, vocabularyId) {
  const result = await pool.query(
    `SELECT * FROM srs_state WHERE user_id = $1 AND vocabulary_id = $2`,
    [userId, vocabularyId]
  );
  return result.rows[0];
}

async function upsertState(userId, vocabularyId, { interval, ef, reps, lastRating }) {
  const nextReview = new Date(Date.now() + interval * 86400000);
  const result = await pool.query(
    `INSERT INTO srs_state (user_id, vocabulary_id, interval, ef, reps, next_review, last_rating, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     ON CONFLICT (user_id, vocabulary_id) DO UPDATE
       SET interval = $3, ef = $4, reps = $5,
           next_review = $6,
           last_rating = $7, updated_at = NOW()
     RETURNING *`,
    [userId, vocabularyId, interval, ef, reps, nextReview, lastRating]
  );
  return result.rows[0];
}

async function getStats(userId, courseId) {
  const due = await pool.query(
    `SELECT COUNT(*)::int AS count FROM vocabulary v
     LEFT JOIN srs_state s ON s.vocabulary_id = v.id AND s.user_id = $1
     WHERE v.course_id = $2 AND (s.next_review IS NULL OR s.next_review <= NOW())`,
    [userId, courseId]
  );
  const learned = await pool.query(
    `SELECT COUNT(*)::int AS count FROM srs_state s
     JOIN vocabulary v ON v.id = s.vocabulary_id
     WHERE s.user_id = $1 AND v.course_id = $2 AND s.reps > 0`,
    [userId, courseId]
  );
  return { due: due.rows[0].count, learned: learned.rows[0].count };
}

module.exports = { getDueCards, getState, upsertState, getStats };
