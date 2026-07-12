const express = require("express");
const router = express.Router();
const { listPassages, listQuestions } = require("../controllers/readingController");

router.get("/courses/:courseId/reading-passages", listPassages);
router.get("/courses/:courseId/comprehension-questions", listQuestions);

module.exports = router;
