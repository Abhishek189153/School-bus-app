const express = require("express");

const router = express.Router();

const protect =
require("../middlewares/auth.middleware");

const authorize =
require("../middlewares/role.middleware");

const {
  getDriverDashboard,
} = require(
  "../controllers/driverDashboard.controller"
);

router.get(
  "/",
  protect,
  authorize("DRIVER"),
  getDriverDashboard
);

module.exports = router;