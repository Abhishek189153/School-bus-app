const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
  startTrip,
  completeTrip,
  getTripDetails,
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

router.get(
    "/:tripId",
    protect,
    getTripDetails
);

module.exports = router;