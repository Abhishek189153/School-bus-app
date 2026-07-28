const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    getWorkingDays,
    updateWorkingDays,
} = require("../controllers/workingDay.controller");

router.get(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    getWorkingDays
);

router.put(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    updateWorkingDays
);

module.exports = router;