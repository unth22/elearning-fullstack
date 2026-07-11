const express = require("express");
const router = express.Router();
const {
  listVocabulary, createVocabularyHandler, updateVocabularyHandler, deleteVocabularyHandler,
} = require("../controllers/vocabularyController");
const { requireAuth, requireAdmin } = require("../middlewares/authMiddleware");

router.get("/courses/:courseId/vocabulary", listVocabulary);

router.post("/admin/courses/:courseId/vocabulary", requireAuth, requireAdmin, createVocabularyHandler);
router.put("/admin/vocabulary/:id", requireAuth, requireAdmin, updateVocabularyHandler);
router.delete("/admin/vocabulary/:id", requireAuth, requireAdmin, deleteVocabularyHandler);

module.exports = router;
