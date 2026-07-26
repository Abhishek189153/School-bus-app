const express = require("express");

const router = express.Router();

const {
  createHoliday,
  getHolidays,
  deleteHoliday,
} = require("../controllers/holiday.controller");

const {
  authenticate,
} = require("../middleware/auth.middleware");

// Add Holiday
router.post(
  "/",
  authenticate,
  createHoliday
);

// Get Holidays
router.get(
  "/",
  authenticate,
  getHolidays
);

// Delete Holiday
router.delete(
  "/:id",
  authenticate,
  deleteHoliday
);

module.exports = router;