const express = require("express");
const router = express.Router();
const {
  listSentences, createSentenceHandler, updateSentenceHandler, deleteSentenceHandler,
} = require("../controllers/sentenceController");
const { requireAuth, requireAdmin } = require("../middlewares/authMiddleware");

router.get("/courses/:courseId/sentences", listSentences);

router.post("/admin/courses/:courseId/sentences", requireAuth, requireAdmin, createSentenceHandler);
router.put("/admin/sentences/:id", requireAuth, requireAdmin, updateSentenceHandler);
router.delete("/admin/sentences/:id", requireAuth, requireAdmin, deleteSentenceHandler);

module.exports = router;
