const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const authorize = require("../middlewares/role.middleware");

const {getDashboardStats} = require("../controllers/admin.controller");

// const {
//     createSchoolAdmin
// } = require("../controllers/admin.controller");

const {
  createSchoolAdmin, getAttendanceHistory, getSchoolAdmins, getSchoolAdmin, updateSchoolAdmin, deleteSchoolAdmin,
} = require(
  "../controllers/admin.controller"
);

const {
  getDashboard,
} = require("../controllers/superAdmin.controller");

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

router.get(
  "/dashboard",
  protect,
  authorize("SUPER_ADMIN"),
  getDashboard
);

router.get(
    "/school-admins",
    protect,
    authorize("SUPER_ADMIN"),
    getSchoolAdmins
);

router.get(
    "/school-admin/:id",
    protect,
    authorize("SUPER_ADMIN"),
    getSchoolAdmin
);

router.put(
    "/school-admin/:id",
    protect,
    authorize("SUPER_ADMIN"),
    updateSchoolAdmin
);

router.delete(
    "/school-admin/:id",
    protect,
    authorize("SUPER_ADMIN"),
    deleteSchoolAdmin
);

module.exports = router;