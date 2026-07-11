const express = require("express");
const router = express.Router();
const {
  listLessons, getLesson, createLessonHandler, updateLessonHandler, deleteLessonHandler,
} = require("../controllers/lessonController");
const { requireAuth, requireAdmin } = require("../middlewares/authMiddleware");

router.get("/courses/:courseId/lessons", listLessons);
router.get("/lessons/:id", getLesson);

router.post("/admin/courses/:courseId/lessons", requireAuth, requireAdmin, createLessonHandler);
router.put("/admin/lessons/:id", requireAuth, requireAdmin, updateLessonHandler);
router.delete("/admin/lessons/:id", requireAuth, requireAdmin, deleteLessonHandler);

module.exports = router;
