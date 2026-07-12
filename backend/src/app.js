const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const vocabularyRoutes = require("./routes/vocabularyRoutes");
const grammarRoutes = require("./routes/grammarRoutes");
const sentenceRoutes = require("./routes/sentenceRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const srsRoutes = require("./routes/srsRoutes");
const activityRoutes = require("./routes/activityRoutes");
const dictionaryRoutes = require("./routes/dictionaryRoutes");
const profileRoutes = require("./routes/profileRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const noteRoutes = require("./routes/noteRoutes");
const moduleProgressRoutes = require("./routes/moduleProgressRoutes");
const phraseRoutes = require("./routes/phraseRoutes");
const dialogueRoutes = require("./routes/dialogueRoutes");

const app = express();

// Chỉ cho phép frontend (Vite, mặc định port 5173) gọi API này
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Phục vụ file tĩnh đã upload (avatar...)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", lessonRoutes);
app.use("/api", vocabularyRoutes);
app.use("/api", grammarRoutes);
app.use("/api", sentenceRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", progressRoutes);
app.use("/api", srsRoutes);
app.use("/api", activityRoutes);
app.use("/api", dictionaryRoutes);
app.use("/api", profileRoutes);
app.use("/api", notificationRoutes);
app.use("/api", noteRoutes);
app.use("/api", moduleProgressRoutes);
app.use("/api", phraseRoutes);
app.use("/api", dialogueRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
