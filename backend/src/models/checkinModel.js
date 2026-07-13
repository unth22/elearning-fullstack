const pool = require("../config/db");

const DAILY_POINTS = 10;

// Định dạng theo ngày giờ địa phương, không dùng toISOString (xem giải thích
// trong activityModel.js — toISOString() quy đổi sang UTC nên với GMT+7 luôn
// bị lùi mất 1 ngày so với ngày thực tế).
function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function checkIn(userId) {
  const result = await pool.query(
    `INSERT INTO daily_checkins (user_id, checkin_date, points)
     VALUES ($1, CURRENT_DATE, $2)
     ON CONFLICT (user_id, checkin_date) DO NOTHING
     RETURNING *`,
    [userId, DAILY_POINTS]
  );
  return result.rows[0] || null;
}

async function getSummary(userId) {
  const totalRes = await pool.query(
    `SELECT COALESCE(SUM(points), 0)::int AS total FROM daily_checkins WHERE user_id = $1`,
    [userId]
  );
  const datesRes = await pool.query(
    `SELECT checkin_date FROM daily_checkins WHERE user_id = $1 ORDER BY checkin_date DESC`,
    [userId]
  );
  const dates = new Set(datesRes.rows.map((r) => toDateStr(new Date(r.checkin_date))));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toDateStr(today);
  const checkedInToday = dates.has(todayStr);

  let cursor = new Date(today);
  if (!checkedInToday) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(toDateStr(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { totalPoints: totalRes.rows[0].total, checkedInToday, streak };
}

module.exports = { checkIn, getSummary, DAILY_POINTS };
