const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
  changeMyPassword,
} = require("../controllers/profileController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { uploadAvatar } = require("../middlewares/uploadMiddleware");

router.get("/profile/me", requireAuth, getMyProfile);
router.put("/profile/me", requireAuth, updateMyProfile);
router.post("/profile/avatar", requireAuth, uploadAvatar.single("avatar"), uploadMyAvatar);
router.put("/profile/password", requireAuth, changeMyPassword);

module.exports = router;
