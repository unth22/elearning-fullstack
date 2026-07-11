const express = require("express");
const router = express.Router();
const {
  listMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notificationController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/notifications/me", requireAuth, listMyNotifications);
router.put("/notifications/me/read-all", requireAuth, markAllNotificationsRead);
router.put("/notifications/:id/read", requireAuth, markNotificationRead);

module.exports = router;
