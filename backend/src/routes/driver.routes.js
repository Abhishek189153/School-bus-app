const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createDriver,
} = require("../controllers/driver.controller");

router.post(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    createDriver
);

module.exports = router;