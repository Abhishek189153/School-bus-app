const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const authorize = require("../middlewares/role.middleware");

const {
    createSchoolAdmin
} = require("../controllers/admin.controller");

router.post(
    "/school-admin",
    protect,
    authorize("SUPER_ADMIN"),
    createSchoolAdmin
);

module.exports = router;