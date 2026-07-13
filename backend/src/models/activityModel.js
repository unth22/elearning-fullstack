const pool = require("../config/db");
const { createNotification, hasNotification } = require("./notificationModel");

const STREAK_MILESTONES = [3, 7, 14, 30];

// Định dạng theo NGÀY THEO GIỜ ĐỊA PHƯƠNG (không dùng toISOString, vì nó quy
// đổi sang UTC trước khi cắt chuỗi — với múi giờ GMT+7, mốc nửa đêm giờ địa
// phương lại rơi vào 17h chiều hôm trước theo UTC, khiến toISOString() luôn
// trả về NGÀY HÔM TRƯỚC thay vì đúng ngày hiện tại).
function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function logActivity(userId) {
  const result = await pool.query(
    `INSERT INTO study_activity (user_id, activity_date)
     VALUES ($1, CURRENT_DATE)
     ON CONFLICT (user_id, activity_date) DO NOTHING
     RETURNING id`,
    [userId]
  );

  // Chỉ kiểm tra mốc streak khi đây là lần học đầu tiên trong ngày hôm nay.
  if (result.rows.length > 0) {
    const streak = await getStreak(userId);
    if (STREAK_MILESTONES.includes(streak)) {
      const title = `Chuỗi ${streak} ngày học liên tiếp!`;
      if (!(await hasNotification(userId, "streak_milestone", title))) {
        await createNotification(userId, {
          type: "streak_milestone",
          title,
          message: `Bạn đã học liên tục ${streak} ngày — tiếp tục duy trì để việc học trở thành thói quen nhé!`,
        });
      }
    }
  }
}

async function getActivityDates(userId) {
  const result = await pool.query(
    `SELECT activity_date FROM study_activity WHERE user_id = $1 ORDER BY activity_date DESC`,
    [userId]
  );
  return result.rows.map((r) => toDateStr(new Date(r.activity_date)));
}

async function getStreak(userId) {
  const dates = new Set(await getActivityDates(userId));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let cursor = new Date(today);
  if (!dates.has(toDateStr(cursor))) {
    // Chưa học hôm nay — vẫn tính streak nếu hôm qua có học.
    cursor.setDate(cursor.getDate() - 1);
    if (!dates.has(toDateStr(cursor))) return 0;
  }

  let streak = 0;
  while (dates.has(toDateStr(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

async function getWeekActivity(userId) {
  const dates = new Set(await getActivityDates(userId));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = (today.getDay() + 6) % 7; // 0 = Thứ 2 (Monday)
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push({ date: toDateStr(d), active: dates.has(toDateStr(d)) });
  }
  return week;
}

module.exports = { logActivity, getStreak, getWeekActivity };
