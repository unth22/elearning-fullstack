const bcrypt = require("bcrypt");
const {
  findUserById,
  updateProfile,
  updateAvatar,
  updatePassword,
  getPasswordHash,
} = require("../models/userModel");

const SALT_ROUNDS = 10;

function toResponse(user) {
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    avatarUrl: user.avatar_url,
    role: user.role,
    createdAt: user.created_at,
  };
}

async function getMyProfile(req, res) {
  try {
    const user = await findUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng." });
    return res.status(200).json(toResponse(user));
  } catch (err) {
    console.error("Lỗi getMyProfile:", err.message);
    return res.status(500).json({ message: "Không thể tải hồ sơ." });
  }
}

async function updateMyProfile(req, res) {
  try {
    const { fullName } = req.body;
    const user = await updateProfile(req.user.userId, { fullName });
    return res.status(200).json(toResponse(user));
  } catch (err) {
    console.error("Lỗi updateMyProfile:", err.message);
    return res.status(500).json({ message: "Không thể cập nhật hồ sơ." });
  }
}

async function uploadMyAvatar(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "Cần chọn một file ảnh." });

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await updateAvatar(req.user.userId, avatarUrl);
    return res.status(200).json(toResponse(user));
  } catch (err) {
    console.error("Lỗi uploadMyAvatar:", err.message);
    return res.status(500).json({ message: "Không thể tải ảnh đại diện lên." });
  }
}

async function changeMyPassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Cần nhập mật khẩu hiện tại và mật khẩu mới." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
    }

    const currentHash = await getPasswordHash(req.user.userId);
    const isValid = await bcrypt.compare(currentPassword, currentHash);
    if (!isValid) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không đúng." });
    }

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await updatePassword(req.user.userId, newHash);
    return res.status(200).json({ message: "Đổi mật khẩu thành công." });
  } catch (err) {
    console.error("Lỗi changeMyPassword:", err.message);
    return res.status(500).json({ message: "Không thể đổi mật khẩu." });
  }
}

module.exports = { getMyProfile, updateMyProfile, uploadMyAvatar, changeMyPassword };
