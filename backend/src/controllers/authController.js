const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/userModel");
const { createNotification } = require("../models/notificationModel");

const SALT_ROUNDS = 10;

async function register(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đủ họ tên, email và mật khẩu." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email này đã được đăng ký." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await createUser({ fullName, email, passwordHash });
    await createNotification(newUser.id, {
      type: "welcome",
      title: "Chào mừng bạn đến với Tiếng Trung Thương Mại!",
      message: `Xin chào ${fullName}, cảm ơn bạn đã đăng ký. Hãy chọn một khóa học để bắt đầu hành trình chinh phục tiếng Trung nhé!`,
    });
    const token = generateToken(newUser);

    return res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error("Lỗi register:", err.message);
    return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu." });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
    }

    const token = generateToken(user);

    return res.status(200).json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Lỗi login:", err.message);
    return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại." });
  }
}

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = { register, login };
