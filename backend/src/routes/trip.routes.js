const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
  startTrip,
  completeTrip,
} = require("../controllers/trip.controller");

router.post(
  "/start",
  protect,
  authorize("DRIVER"),
  startTrip
);

router.post(
  "/complete",
  protect,
  authorize("DRIVER"),
  completeTrip
);

module.exports = router;