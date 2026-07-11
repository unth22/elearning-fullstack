const { getProgressForCourse, setLessonProgress } = require("../models/progressModel");
const { getLessonById } = require("../models/lessonModel");
const { getCourseById } = require("../models/courseModel");
const { logActivity } = require("../models/activityModel");
const { createNotification, hasNotification } = require("../models/notificationModel");

async function getMyProgress(req, res) {
  try {
    const { courseId } = req.query;
    if (!courseId) return res.status(400).json({ message: "Cần có mã khóa học." });

    const progress = await getProgressForCourse(req.user.userId, courseId);
    return res.status(200).json(progress);
  } catch (err) {
    console.error("Lỗi getMyProgress:", err.message);
    return res.status(500).json({ message: "Không thể tải tiến độ học tập." });
  }
}

async function updateMyProgress(req, res) {
  try {
    const { lessonId, isCompleted } = req.body;
    if (!lessonId) return res.status(400).json({ message: "Cần có mã bài học." });

    const lesson = await getLessonById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Không tìm thấy bài học." });

    const progress = await setLessonProgress(req.user.userId, lessonId, !!isCompleted);
    if (isCompleted) {
      await logActivity(req.user.userId);

      const courseProgress = await getProgressForCourse(req.user.userId, lesson.course_id);
      const allDone = courseProgress.length > 0 && courseProgress.every((p) => p.is_completed);
      if (allDone) {
        const course = await getCourseById(lesson.course_id);
        const title = `Hoàn thành khóa học: ${course.title}`;
        if (!(await hasNotification(req.user.userId, "course_completed", title))) {
          await createNotification(req.user.userId, {
            type: "course_completed",
            title,
            message: `Chúc mừng bạn đã hoàn thành toàn bộ nội dung khóa học "${course.title}"! Hãy tiếp tục ôn tập từ vựng hoặc khám phá khóa học khác.`,
          });
        }
      }
    }
    return res.status(200).json(progress);
  } catch (err) {
    console.error("Lỗi updateMyProgress:", err.message);
    return res.status(500).json({ message: "Không thể cập nhật tiến độ." });
  }
}

module.exports = { getMyProgress, updateMyProgress };
