const { getModuleProgress, markStepDone } = require("../models/moduleProgressModel");
const { logActivity } = require("../models/activityModel");
const { checkIn } = require("../models/checkinModel");

async function listMyModuleProgress(req, res) {
  try {
    const rows = await getModuleProgress(req.user.userId, req.params.courseId);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Lỗi listMyModuleProgress:", err.message);
    return res.status(500).json({ message: "Không thể tải tiến độ học." });
  }
}

async function markMyModuleStep(req, res) {
  try {
    const { courseId, moduleIndex, stepId } = req.body;
    if (courseId == null || moduleIndex == null || !stepId) {
      return res.status(400).json({ message: "Thiếu thông tin bước học." });
    }
    const row = await markStepDone(req.user.userId, courseId, moduleIndex, stepId);
    // Học bất kỳ bước nào trong bài cũng tính là "đã học hôm nay":
    // tự động điểm danh (+ điểm) và tính vào chuỗi ngày học (streak),
    // không cần bấm nút điểm danh thủ công nữa.
    await Promise.all([logActivity(req.user.userId), checkIn(req.user.userId)]);
    return res.status(200).json(row || { alreadyDone: true });
  } catch (err) {
    console.error("Lỗi markMyModuleStep:", err.message);
    return res.status(500).json({ message: "Không thể lưu tiến độ học." });
  }
}

module.exports = { listMyModuleProgress, markMyModuleStep };
