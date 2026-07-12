const express = require("express");
const router = express.Router();
const { listMyModuleProgress, markMyModuleStep } = require("../controllers/moduleProgressController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/module-progress/me/:courseId", requireAuth, listMyModuleProgress);
router.post("/module-progress/me", requireAuth, markMyModuleStep);

module.exports = router;
