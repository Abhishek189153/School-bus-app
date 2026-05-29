const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
  dutyOn,
  dutyOff,
} = require("../controllers/attendance.controller");

router.post(
  "/duty-on",
  protect,
  authorize("DRIVER"),
  dutyOn
);

router.post(
  "/duty-off",
  protect,
  authorize("DRIVER"),
  dutyOff
);

module.exports = router;