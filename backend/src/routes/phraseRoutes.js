const express = require("express");
const router = express.Router();
const { listPhrases } = require("../controllers/phraseController");

router.get("/courses/:courseId/phrases", listPhrases);

module.exports = router;
