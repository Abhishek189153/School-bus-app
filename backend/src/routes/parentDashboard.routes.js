const express = require("express");

const router = express.Router();

const protect =
require("../middlewares/auth.middleware");

const authorize =
require("../middlewares/role.middleware");

const {
  getParentDashboard,
} = require(
  "../controllers/parentDashboard.controller"
);

router.get(
  "/",
  protect,
  authorize("PARENT"),
  getParentDashboard
);

module.exports = router;