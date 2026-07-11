const fs = require("fs");
const path = require("path");
const multer = require("multer");

const avatarDir = path.join(__dirname, "../../uploads/avatars");
fs.mkdirSync(avatarDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `avatar_${req.user.userId}_${Date.now()}${ext}`);
  },
});

function imageFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Chỉ chấp nhận file ảnh."));
  }
  cb(null, true);
}

const uploadAvatar = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = { uploadAvatar };
