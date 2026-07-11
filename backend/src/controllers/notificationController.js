const {
  getNotificationsByUser,
  markAsRead,
  markAllAsRead,
} = require("../models/notificationModel");

async function listMyNotifications(req, res) {
  try {
    const notifications = await getNotificationsByUser(req.user.userId);
    return res.status(200).json(notifications);
  } catch (err) {
    console.error("Lỗi listMyNotifications:", err.message);
    return res.status(500).json({ message: "Không thể tải thông báo." });
  }
}

async function markNotificationRead(req, res) {
  try {
    const notification = await markAsRead(req.params.id, req.user.userId);
    if (!notification) return res.status(404).json({ message: "Không tìm thấy thông báo." });
    return res.status(200).json(notification);
  } catch (err) {
    console.error("Lỗi markNotificationRead:", err.message);
    return res.status(500).json({ message: "Không thể cập nhật thông báo." });
  }
}

async function markAllNotificationsRead(req, res) {
  try {
    await markAllAsRead(req.user.userId);
    return res.status(200).json({ message: "Đã đánh dấu tất cả đã đọc." });
  } catch (err) {
    console.error("Lỗi markAllNotificationsRead:", err.message);
    return res.status(500).json({ message: "Không thể cập nhật thông báo." });
  }
}

module.exports = { listMyNotifications, markNotificationRead, markAllNotificationsRead };
