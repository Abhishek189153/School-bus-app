const express = require("express");

const router = express.Router();

const protect =
require("../middlewares/auth.middleware");

const authorize =
require("../middlewares/role.middleware");

const {
    getDashboardStats
} =
require("../controllers/dashboard.controller");

router.get(
    "/stats",
    protect,
    authorize("SCHOOL_ADMIN"),
    getDashboardStats
);

module.exports = router;