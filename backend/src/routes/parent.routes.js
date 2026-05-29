const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createParent,
} = require("../controllers/parent.controller");

router.post(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    createParent
);

module.exports = router;