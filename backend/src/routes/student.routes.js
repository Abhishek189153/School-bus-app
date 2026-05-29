const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createStudent,
} = require("../controllers/student.controller");

router.post(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    createStudent
);

module.exports = router;