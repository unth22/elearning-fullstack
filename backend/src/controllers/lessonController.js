const {
  getLessonsByCourseId,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} = require("../models/lessonModel");
const { getCourseById } = require("../models/courseModel");

async function listLessons(req, res) {
  try {
    const lessons = await getLessonsByCourseId(req.params.courseId);
    return res.status(200).json(lessons);
  } catch (err) {
    console.error("Lỗi listLessons:", err.message);
    return res.status(500).json({ message: "Không thể tải danh sách bài học." });
  }
}

async function getLesson(req, res) {
  try {
    const lesson = await getLessonById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Không tìm thấy bài học." });
    return res.status(200).json(lesson);
  } catch (err) {
    console.error("Lỗi getLesson:", err.message);
    return res.status(500).json({ message: "Lỗi máy chủ." });
  }
}

async function createLessonHandler(req, res) {
  try {
    const { courseId } = req.params;
    const course = await getCourseById(courseId);
    if (!course) return res.status(404).json({ message: "Khóa học không tồn tại." });

    const { title, videoUrl, durationSeconds, orderIndex } = req.body;
    if (!title || !orderIndex) {
      return res.status(400).json({ message: "Cần có tên bài học và thứ tự bài học." });
    }

    const lesson = await createLesson({ courseId, title, videoUrl, durationSeconds, orderIndex });
    return res.status(201).json(lesson);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Thứ tự bài học này đã được dùng trong khóa học." });
    }
    console.error("Lỗi createLessonHandler:", err.message);
    return res.status(500).json({ message: "Không thể thêm bài học." });
  }
}

async function updateLessonHandler(req, res) {
  try {
    const existing = await getLessonById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Không tìm thấy bài học." });

    const { title, videoUrl, durationSeconds, orderIndex } = req.body;
    const updated = await updateLesson(req.params.id, { title, videoUrl, durationSeconds, orderIndex });
    return res.status(200).json(updated);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Thứ tự bài học này đã được dùng trong khóa học." });
    }
    console.error("Lỗi updateLessonHandler:", err.message);
    return res.status(500).json({ message: "Không thể cập nhật bài học." });
  }
}

async function deleteLessonHandler(req, res) {
  try {
    const deleted = await deleteLesson(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy bài học." });
    return res.status(200).json({ message: "Đã xóa bài học.", id: deleted.id });
  } catch (err) {
    console.error("Lỗi deleteLessonHandler:", err.message);
    return res.status(500).json({ message: "Không thể xóa bài học." });
  }
}

module.exports = {
  listLessons, getLesson, createLessonHandler, updateLessonHandler, deleteLessonHandler,
};
