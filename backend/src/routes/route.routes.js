const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createRoute,
} = require("../controllers/route.controller");

router.post(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    createRoute
);

module.exports = router;