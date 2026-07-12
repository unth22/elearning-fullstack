const { getDialogueByCourseId } = require("../models/dialogueModel");

async function listDialogue(req, res) {
  try {
    const lines = await getDialogueByCourseId(req.params.courseId);
    return res.status(200).json(lines);
  } catch (err) {
    console.error("Lỗi listDialogue:", err.message);
    return res.status(500).json({ message: "Không thể tải hội thoại." });
  }
}

module.exports = { listDialogue };
