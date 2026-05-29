const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    assignDriverToBus,
    assignStudentToBus,
} = require("../controllers/assignment.controller");

router.put(
    "/assign-driver",
    protect,
    authorize("SCHOOL_ADMIN"),
    assignDriverToBus
);

router.put(
    "/assign-student",
    protect,
    authorize("SCHOOL_ADMIN"),
    assignStudentToBus
);

module.exports = router;