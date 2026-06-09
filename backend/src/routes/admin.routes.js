const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const authorize = require("../middlewares/role.middleware");

const {getDashboardStats} = require("../controllers/admin.controller");

const {
    createSchoolAdmin
} = require("../controllers/admin.controller");

const {
  getAttendanceHistory,
} = require(
  "../controllers/admin.controller"
);

router.post(
    "/school-admin",
    protect,
    authorize("SUPER_ADMIN"),
    createSchoolAdmin
);

router.get(
  "/dashboard-stats",
  protect,
  authorize("SCHOOL_ADMIN"),
  getDashboardStats
);

router.get(
  "/attendance-history",
 protect,
  authorize("SCHOOL_ADMIN"),
  getAttendanceHistory
);

module.exports = router;