const express = require("express");
const router = express.Router();
const { getMyProgress, updateMyProgress } = require("../controllers/progressController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/progress/me", requireAuth, getMyProgress);
router.post("/progress", requireAuth, updateMyProgress);

module.exports = router;
