const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createSchool,
    getSchools
} = require("../controllers/school.controller");


router.post(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    createSchool
);

router.get(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    getSchools
);

module.exports = router;