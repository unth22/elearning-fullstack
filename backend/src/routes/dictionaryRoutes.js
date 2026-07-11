const express = require("express");
const router = express.Router();
const { search, explain } = require("../controllers/dictionaryController");
const { requireAuth } = require("../middlewares/authMiddleware");

// Tra cứu công khai (không cần đăng nhập)
router.get("/dict/search", search);

// Giải thích chi tiết bằng AI — cần đăng nhập vì tốn phí gọi API mỗi lần
router.post("/dict/explain", requireAuth, explain);

module.exports = router;
