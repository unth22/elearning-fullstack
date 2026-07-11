const express = require("express");
const router = express.Router();
const {
  listGrammar, createGrammarHandler, updateGrammarHandler, deleteGrammarHandler,
} = require("../controllers/grammarController");
const { requireAuth, requireAdmin } = require("../middlewares/authMiddleware");

router.get("/courses/:courseId/grammar", listGrammar);

router.post("/admin/courses/:courseId/grammar", requireAuth, requireAdmin, createGrammarHandler);
router.put("/admin/grammar/:id", requireAuth, requireAdmin, updateGrammarHandler);
router.delete("/admin/grammar/:id", requireAuth, requireAdmin, deleteGrammarHandler);

module.exports = router;
