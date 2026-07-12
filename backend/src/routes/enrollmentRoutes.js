const express = require("express");
const router = express.Router();
const { enrollHandler, listMyEnrollments, getMyLatestEnrollment, setMyGoal } = require("../controllers/enrollmentController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/enrollments", requireAuth, enrollHandler);
router.get("/enrollments/me", requireAuth, listMyEnrollments);
router.get("/enrollments/me/latest", requireAuth, getMyLatestEnrollment);
router.put("/enrollments/goal", requireAuth, setMyGoal);

module.exports = router;
