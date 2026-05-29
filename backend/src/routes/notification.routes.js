const express = require("express");

const router = express.Router();

const protect =
require("../middlewares/auth.middleware");

const {
  saveFcmToken,
} = require("../controllers/notification.controller");

router.post(
  "/save-token",
  protect,
  saveFcmToken
);

module.exports = router;