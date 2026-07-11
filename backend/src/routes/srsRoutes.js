const express = require("express");
const router = express.Router();
const { listDueCards, rateCardHandler, getStatsHandler } = require("../controllers/srsController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/srs/due", requireAuth, listDueCards);
router.get("/srs/stats", requireAuth, getStatsHandler);
router.post("/srs/rate", requireAuth, rateCardHandler);

module.exports = router;
