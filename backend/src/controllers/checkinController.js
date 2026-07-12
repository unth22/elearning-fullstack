const { checkIn, getSummary, DAILY_POINTS } = require("../models/checkinModel");

async function getMyCheckin(req, res) {
  try {
    const summary = await getSummary(req.user.userId);
    return res.status(200).json(summary);
  } catch (err) {
    console.error("Lỗi getMyCheckin:", err.message);
    return res.status(500).json({ message: "Không thể tải dữ liệu điểm danh." });
  }
}

async function postCheckin(req, res) {
  try {
    const created = await checkIn(req.user.userId);
    const summary = await getSummary(req.user.userId);
    return res.status(200).json({ ...summary, justEarned: created ? DAILY_POINTS : 0 });
  } catch (err) {
    console.error("Lỗi postCheckin:", err.message);
    return res.status(500).json({ message: "Không thể điểm danh." });
  }
}

module.exports = { getMyCheckin, postCheckin };
