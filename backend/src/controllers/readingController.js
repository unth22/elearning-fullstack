const { getPassagesByCourseId, getQuestionsByCourseId } = require("../models/readingModel");

async function listPassages(req, res) {
  try {
    const passages = await getPassagesByCourseId(req.params.courseId);
    return res.status(200).json(passages);
  } catch (err) {
    console.error("Lỗi listPassages:", err.message);
    return res.status(500).json({ message: "Không thể tải bài khóa." });
  }
}

async function listQuestions(req, res) {
  try {
    const questions = await getQuestionsByCourseId(req.params.courseId);
    return res.status(200).json(questions);
  } catch (err) {
    console.error("Lỗi listQuestions:", err.message);
    return res.status(500).json({ message: "Không thể tải câu hỏi đọc hiểu." });
  }
}

module.exports = { listPassages, listQuestions };
