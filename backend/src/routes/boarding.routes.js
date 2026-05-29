const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
  markBoarding,
} = require("../controllers/boarding.controller");

router.post(
  "/",
  protect,
  authorize("DRIVER"),
  markBoarding
);

module.exports = router;