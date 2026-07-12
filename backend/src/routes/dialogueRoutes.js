const express = require("express");
const router = express.Router();
const { listDialogue } = require("../controllers/dialogueController");

router.get("/courses/:courseId/dialogue", listDialogue);

module.exports = router;
