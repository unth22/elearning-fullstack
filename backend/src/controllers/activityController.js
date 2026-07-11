const { getStreak, getWeekActivity } = require("../models/activityModel");

async function getMyActivity(req, res) {
  try {
    const [streak, week] = await Promise.all([
      getStreak(req.user.userId),
      getWeekActivity(req.user.userId),
    ]);
    return res.status(200).json({ streak, week });
  } catch (err) {
    console.error("Lỗi getMyActivity:", err.message);
    return res.status(500).json({ message: "Không thể tải hoạt động học tập." });
  }
}

module.exports = { getMyActivity };
