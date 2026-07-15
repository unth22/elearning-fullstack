const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  findUserByEmail, createUser, setResetToken, findUserByResetToken, clearResetToken, updatePassword,
} = require("../models/userModel");
const { createNotification } = require("../models/notificationModel");

const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 giờ

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

    // TẠM THỜI (chỉ set ở .env local, không có ở production) — cho phép bỏ
    // qua kiểm tra mật khẩu để test/demo, vẫn cần đúng email đã đăng ký.
    const bypassPassword = process.env.DEV_BYPASS_PASSWORD === "true";
    const isPasswordValid = bypassPassword || (await bcrypt.compare(password, user.password_hash));
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
    }

    const token = generateToken(user);

    return res.status(200).json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        avatarUrl: user.avatar_url,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Lỗi login:", err.message);
    return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại." });
  }
}

// Luôn trả về cùng 1 thông báo chung chung dù email có tồn tại hay không,
// để không lộ thông tin email nào đã đăng ký (tránh dò email hàng loạt).
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Vui lòng nhập email." });
    }

    const genericMessage = "Nếu email này đã đăng ký, chúng tôi đã gửi link đặt lại mật khẩu tới hộp thư của bạn.";
    const user = await findUserByEmail(email);
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await setResetToken(user.id, token, expiresAt);

      const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;
      // TODO: chưa cấu hình dịch vụ gửi email (SMTP/API key) — tạm thời in
      // link ra log để test; khi có credentials thật thì thay đoạn này bằng
      // lệnh gửi email thật (vd. nodemailer/Resend/SendGrid).
      console.log(`📧 [Đặt lại mật khẩu] Gửi tới ${email}: ${resetLink}`);
    }

    return res.status(200).json({ message: genericMessage });
  } catch (err) {
    console.error("Lỗi forgotPassword:", err.message);
    return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại." });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Thiếu thông tin đặt lại mật khẩu." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
    }

    const user = await findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await updatePassword(user.id, passwordHash);
    await clearResetToken(user.id);

    return res.status(200).json({ message: "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay." });
  } catch (err) {
    console.error("Lỗi resetPassword:", err.message);
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

module.exports = { register, login, forgotPassword, resetPassword };
