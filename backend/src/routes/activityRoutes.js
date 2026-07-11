const express = require("express");
const router = express.Router();
const { getMyActivity } = require("../controllers/activityController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/activity/me", requireAuth, getMyActivity);

module.exports = router;
