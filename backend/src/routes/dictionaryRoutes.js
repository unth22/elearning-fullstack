const express = require("express");
const router = express.Router();
const { search } = require("../controllers/dictionaryController");

// Tra cứu công khai (không cần đăng nhập)
router.get("/dict/search", search);

module.exports = router;
