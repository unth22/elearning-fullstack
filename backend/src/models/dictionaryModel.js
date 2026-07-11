const pool = require("../config/db");

// Tra cứu từ vựng chuyên ngành trong toàn bộ kho từ (mọi khóa học,
// kể cả khóa đang ẩn) — dùng cho ô "Tra cứu nhanh" trên dashboard.
async function searchVocabulary(query, limit = 20) {
  const like = `%${query}%`;
  const result = await pool.query(
    `SELECT v.id, v.zh, v.pinyin, v.vi, v.en, v.tags,
            c.title AS course_title, c.icon AS course_icon, c.accent_color
     FROM vocabulary v
     JOIN courses c ON c.id = v.course_id
     WHERE v.zh ILIKE $1 OR v.pinyin ILIKE $1 OR v.vi ILIKE $1 OR v.en ILIKE $1
     ORDER BY (v.zh = $2) DESC, char_length(v.zh) ASC, v.zh ASC
     LIMIT $3`,
    [like, query, limit]
  );
  return result.rows;
}

module.exports = { searchVocabulary };
