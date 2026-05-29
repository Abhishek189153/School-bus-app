const express = require("express");

const router = express.Router();

const protect =
require("../middlewares/auth.middleware");

const {
  saveFcmToken,
   getMyNotifications
} = require("../controllers/notification.controller");

router.post(
  "/save-token",
  protect,
  saveFcmToken
);

router.get(
  "/my",
  protect,
  getMyNotifications
);


module.exports = router;