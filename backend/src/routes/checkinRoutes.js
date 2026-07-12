const express = require("express");
const router = express.Router();
const { getMyCheckin, postCheckin } = require("../controllers/checkinController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/checkin/me", requireAuth, getMyCheckin);
router.post("/checkin/me", requireAuth, postCheckin);

module.exports = router;
