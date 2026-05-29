const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createBus,
} = require("../controllers/bus.controller");

router.post(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    createBus
);

module.exports = router;