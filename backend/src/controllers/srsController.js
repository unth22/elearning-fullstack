const { getDueCards, getState, upsertState, getStats } = require("../models/srsModel");
const { srsNext } = require("../utils/srsEngine");
const { logActivity } = require("../models/activityModel");

async function listDueCards(req, res) {
  try {
    const { courseId } = req.query;
    if (!courseId) return res.status(400).json({ message: "Cần có mã khóa học." });

    const cards = await getDueCards(req.user.userId, courseId);
    return res.status(200).json(cards);
  } catch (err) {
    console.error("Lỗi listDueCards:", err.message);
    return res.status(500).json({ message: "Không thể tải thẻ cần ôn." });
  }
}

async function rateCardHandler(req, res) {
  try {
    const { vocabularyId, rating } = req.body;
    if (vocabularyId == null || rating == null) {
      return res.status(400).json({ message: "Cần có mã từ vựng và mức đánh giá." });
    }

    const prev = await getState(req.user.userId, vocabularyId);
    const next = srsNext(prev, rating);
    const state = await upsertState(req.user.userId, vocabularyId, next);
    await logActivity(req.user.userId);
    return res.status(200).json(state);
  } catch (err) {
    console.error("Lỗi rateCardHandler:", err.message);
    return res.status(500).json({ message: "Không thể lưu kết quả ôn tập." });
  }
}

async function getStatsHandler(req, res) {
  try {
    const { courseId } = req.query;
    if (!courseId) return res.status(400).json({ message: "Cần có mã khóa học." });

    const stats = await getStats(req.user.userId, courseId);
    return res.status(200).json(stats);
  } catch (err) {
    console.error("Lỗi getStatsHandler:", err.message);
    return res.status(500).json({ message: "Không thể tải thống kê ôn tập." });
  }
}

module.exports = { listDueCards, rateCardHandler, getStatsHandler };
