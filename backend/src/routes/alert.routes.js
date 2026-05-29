const express = require("express");

const router = express.Router();

const protect =
require("../middlewares/auth.middleware");

const authorize =
require("../middlewares/role.middleware");

const {
  sendBusAlert,
} = require("../controllers/alert.controller");

router.post(
  "/bus-alert",
  protect,
  authorize(
    "SCHOOL_ADMIN",
    "SUPER_ADMIN"
  ),
  sendBusAlert
);

module.exports = router;