const { enroll, getEnrollmentsByUser, getLatestEnrollment } = require("../models/enrollmentModel");
const { getCourseById } = require("../models/courseModel");

async function enrollHandler(req, res) {
  try {
    const { courseId, startLevel, goal } = req.body;
    if (!courseId) return res.status(400).json({ message: "Cần có mã khóa học." });

    const course = await getCourseById(courseId);
    if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học." });

    const enrollment = await enroll(req.user.userId, courseId, { startLevel, goal });
    return res.status(201).json(enrollment);
  } catch (err) {
    console.error("Lỗi enrollHandler:", err.message);
    return res.status(500).json({ message: "Không thể đăng ký khóa học." });
  }
}

async function listMyEnrollments(req, res) {
  try {
    const enrollments = await getEnrollmentsByUser(req.user.userId);
    return res.status(200).json(enrollments);
  } catch (err) {
    console.error("Lỗi listMyEnrollments:", err.message);
    return res.status(500).json({ message: "Không thể tải danh sách khóa học đã đăng ký." });
  }
}

async function getMyLatestEnrollment(req, res) {
  try {
    const enrollment = await getLatestEnrollment(req.user.userId);
    return res.status(200).json(enrollment || null);
  } catch (err) {
    console.error("Lỗi getMyLatestEnrollment:", err.message);
    return res.status(500).json({ message: "Không thể tải khóa học gần nhất." });
  }
}

module.exports = { enrollHandler, listMyEnrollments, getMyLatestEnrollment };
