const express = require("express");
const router = express.Router();
const { listMyNotes, createMyNote, updateMyNote, deleteMyNote } = require("../controllers/noteController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/notes/me/:courseId", requireAuth, listMyNotes);
router.post("/notes/me", requireAuth, createMyNote);
router.put("/notes/:id", requireAuth, updateMyNote);
router.delete("/notes/:id", requireAuth, deleteMyNote);

module.exports = router;
