const {
  getAllPublishedCourses,
  getAllCoursesForAdmin,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../models/courseModel");

async function listCourses(req, res) {
  try {
    const courses = await getAllPublishedCourses();
    return res.status(200).json(courses);
  } catch (err) {
    console.error("Lỗi listCourses:", err.message);
    return res.status(500).json({ message: "Không thể tải danh sách khóa học." });
  }
}

async function listCoursesForAdmin(req, res) {
  try {
    const courses = await getAllCoursesForAdmin();
    return res.status(200).json(courses);
  } catch (err) {
    console.error("Lỗi listCoursesForAdmin:", err.message);
    return res.status(500).json({ message: "Không thể tải danh sách khóa học." });
  }
}

async function getCourse(req, res) {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học." });
    return res.status(200).json(course);
  } catch (err) {
    console.error("Lỗi getCourse:", err.message);
    return res.status(500).json({ message: "Lỗi máy chủ." });
  }
}

async function createCourseHandler(req, res) {
  try {
    const { title, description, industry, coverUrl, icon, accentColor, nameZh, level } = req.body;
    if (!title) return res.status(400).json({ message: "Tên khóa học là bắt buộc." });

    const course = await createCourse({
      title, description, industry, coverUrl, createdBy: req.user.userId,
      icon, accentColor, nameZh, level,
    });
    return res.status(201).json(course);
  } catch (err) {
    console.error("Lỗi createCourseHandler:", err.message);
    return res.status(500).json({ message: "Không thể tạo khóa học." });
  }
}

async function updateCourseHandler(req, res) {
  try {
    const existing = await getCourseById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Không tìm thấy khóa học." });

    const { title, description, industry, coverUrl, isPublished, icon, accentColor, nameZh, level } = req.body;
    const updated = await updateCourse(req.params.id, {
      title, description, industry, coverUrl, isPublished, icon, accentColor, nameZh, level,
    });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Lỗi updateCourseHandler:", err.message);
    return res.status(500).json({ message: "Không thể cập nhật khóa học." });
  }
}

async function deleteCourseHandler(req, res) {
  try {
    const deleted = await deleteCourse(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy khóa học." });
    return res.status(200).json({ message: "Đã xóa khóa học.", id: deleted.id });
  } catch (err) {
    console.error("Lỗi deleteCourseHandler:", err.message);
    return res.status(500).json({ message: "Không thể xóa khóa học." });
  }
}

module.exports = {
  listCourses, listCoursesForAdmin, getCourse,
  createCourseHandler, updateCourseHandler, deleteCourseHandler,
};
