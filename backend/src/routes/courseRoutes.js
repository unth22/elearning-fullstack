const express = require("express");
const router = express.Router();
const {
  listCourses, listCoursesForAdmin, getCourse,
  createCourseHandler, updateCourseHandler, deleteCourseHandler,
} = require("../controllers/courseController");
const { requireAuth, requireAdmin } = require("../middlewares/authMiddleware");

router.get("/courses", listCourses);
router.get("/courses/:id", getCourse);

router.get("/admin/courses", requireAuth, requireAdmin, listCoursesForAdmin);
router.post("/admin/courses", requireAuth, requireAdmin, createCourseHandler);
router.put("/admin/courses/:id", requireAuth, requireAdmin, updateCourseHandler);
router.delete("/admin/courses/:id", requireAuth, requireAdmin, deleteCourseHandler);

module.exports = router;
