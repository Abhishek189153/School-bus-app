const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
  createHoliday,
  getHolidays,
  deleteHoliday,
} = require("../controllers/holiday.controller");

// Add Holiday
router.post(
  "/",
  protect,
  authorize("SCHOOL_ADMIN"),
  createHoliday
);

// Get Holidays
router.get(
  "/",
  protect,
  authorize("SCHOOL_ADMIN"),
  getHolidays
);

// Delete Holiday
router.delete(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  deleteHoliday
);

module.exports = router;