const express = require("express");

const router = express.Router();

const protect =
  require("../middlewares/auth.middleware");

const authorize =
  require("../middlewares/role.middleware");

const {
  getAttendanceHistory,
   getDriverAttendanceHistory,
} = require(
  "../controllers/attendance.controller"
);

router.get(
  "/history",
  protect,
  authorize(
    "SCHOOL_ADMIN",
    "SUPER_ADMIN"
  ),
  getAttendanceHistory
);


router.get(
  "/driver-history",
  protect,
  authorize(
    "SCHOOL_ADMIN",
    "SUPER_ADMIN"
  ),
  getDriverAttendanceHistory
);


module.exports = router;