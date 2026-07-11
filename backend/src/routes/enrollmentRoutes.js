const express = require("express");
const router = express.Router();
const { enrollHandler, listMyEnrollments, getMyLatestEnrollment } = require("../controllers/enrollmentController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/enrollments", requireAuth, enrollHandler);
router.get("/enrollments/me", requireAuth, listMyEnrollments);
router.get("/enrollments/me/latest", requireAuth, getMyLatestEnrollment);

module.exports = router;
