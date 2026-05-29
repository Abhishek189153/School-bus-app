const express = require("express");

const router = express.Router();

const protect =
require("../middlewares/auth.middleware");

const authorize =
require("../middlewares/role.middleware");

const {
  updateLocation,
  getBusLocation,
} = require("../controllers/location.controller");

router.post(
  "/update",
  protect,
  authorize("DRIVER"),
  updateLocation
);

router.get(
  "/:busId",
  protect,
  getBusLocation
);

module.exports = router;