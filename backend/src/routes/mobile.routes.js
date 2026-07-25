const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const authorize =
require("../middlewares/role.middleware");

const {
  getDriverDashboard,
  startTrip,
  endTrip,
    getTripStudents,
    boardStudent,
    unboardStudent,
    tripSummary,
    tripHistory,
    getAssignedRoutes,
    dutyOn,
    dutyOff,
    getDutyStatus,
    getBoardedStudents,
    getMyBusLocation,
    getProfile,
    updateProfileImage,
    getHistory,
    updateNotificationSettings,
    getNotificationSettings,
    savePushToken,
    testNotification,
    sendForgotPasswordOTP,
    verifyForgotPasswordOTP,
    resetPassword,
      

} = require("../controllers/mobile.controller");

const {
  getParentDashboard,
} = require("../controllers/parent.controller");

router.get(
  "/driver-dashboard",
  protect,
  getDriverDashboard
);

router.post(
  "/start-trip",
  protect,
  startTrip
);

router.post(
  "/end-trip/:tripId",
  protect,
  endTrip
);

router.get(
  "/trip-students/:tripId",
  protect,
  getTripStudents
);

router.post(
  "/board-student",
  protect,
  boardStudent
);

router.post(
  "/unboard-student",
  protect,
  unboardStudent
);

router.get(
  "/trip-summary/:tripId",
  protect,
  tripSummary
);

router.get(
  "/trip-history",
  protect,
  tripHistory
);

router.get(
  "/assigned-routes",
  protect,
  getAssignedRoutes
);

router.post(
  "/duty-on",
  protect,
  dutyOn
);

router.post(
  "/duty-off",
  protect,
  dutyOff
);

router.get(
  "/duty-status",
  protect,
  getDutyStatus
);

router.get(
  "/boarded-students/:tripId",
  protect,
  getBoardedStudents
);

router.get(
  "/parent-dashboard",
  protect,
  getParentDashboard
);

router.get(
  "/my-bus-location",
  protect,
  authorize("PARENT"),
  getMyBusLocation
);

router.get(
  "/profile",
  protect,
  authorize("PARENT"),
  getProfile
);

router.put(
  "/profile-image",
  protect,
  updateProfileImage
);

router.get(
  "/history",
  protect,
  authorize("PARENT"),
  getHistory
);

router.put(
  "/notification-settings",
  protect,
  updateNotificationSettings
);

router.get(
  "/notification-settings",
  protect,
  getNotificationSettings
);

router.put(
  "/push-token",
  protect,
  savePushToken
);

router.get(
  "/test-notification",
protect,
  testNotification
);

router.post(
  "/send-forgot-password-otp",
  sendForgotPasswordOTP
);

router.post(
  "/verify-forgot-password-otp",
  verifyForgotPasswordOTP
);

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;