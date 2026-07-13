const { getStreak, getWeekActivity, getActivityDates } = require("../models/activityModel");

async function getMyActivity(req, res) {
  try {
    // activeDates trả về toàn bộ ngày đã học (không giới hạn tuần này), để
    // frontend tự dựng lịch tháng này/tháng trước mà không cần gọi thêm API.
    const [streak, week, activeDates] = await Promise.all([
      getStreak(req.user.userId),
      getWeekActivity(req.user.userId),
      getActivityDates(req.user.userId),
    ]);
    return res.status(200).json({ streak, week, activeDates });
  } catch (err) {
    console.error("Lỗi getMyActivity:", err.message);
    return res.status(500).json({ message: "Không thể tải hoạt động học tập." });
  }
}

module.exports = { getMyActivity };
