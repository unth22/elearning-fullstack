const { getNotesByUserAndCourse, createNote, updateNote, deleteNote } = require("../models/noteModel");

async function listMyNotes(req, res) {
  try {
    const notes = await getNotesByUserAndCourse(req.user.userId, req.params.courseId);
    return res.status(200).json(notes);
  } catch (err) {
    console.error("Lỗi listMyNotes:", err.message);
    return res.status(500).json({ message: "Không thể tải ghi chú." });
  }
}

async function createMyNote(req, res) {
  try {
    const { courseId, selectedText, note, color } = req.body;
    if (!courseId || !selectedText) {
      return res.status(400).json({ message: "Thiếu khóa học hoặc đoạn text đã chọn." });
    }
    const created = await createNote(req.user.userId, { courseId, selectedText, note, color });
    return res.status(201).json(created);
  } catch (err) {
    console.error("Lỗi createMyNote:", err.message);
    return res.status(500).json({ message: "Không thể lưu ghi chú." });
  }
}

async function updateMyNote(req, res) {
  try {
    const { note, color } = req.body;
    const updated = await updateNote(req.params.id, req.user.userId, { note, color });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy ghi chú." });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Lỗi updateMyNote:", err.message);
    return res.status(500).json({ message: "Không thể cập nhật ghi chú." });
  }
}

async function deleteMyNote(req, res) {
  try {
    const deleted = await deleteNote(req.params.id, req.user.userId);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy ghi chú." });
    return res.status(200).json({ message: "Đã xóa ghi chú.", id: deleted.id });
  } catch (err) {
    console.error("Lỗi deleteMyNote:", err.message);
    return res.status(500).json({ message: "Không thể xóa ghi chú." });
  }
}

module.exports = { listMyNotes, createMyNote, updateMyNote, deleteMyNote };
