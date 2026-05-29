const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createDriver,
    getDrivers,
    getDriverById,
    updateDriver,
    deleteDriver
} = require("../controllers/driver.controller");

router.post(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    createDriver
);

router.get(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    getDrivers
);

router.get(
    "/:id",
    protect,
    authorize("SCHOOL_ADMIN"),
    getDriverById
);


router.put(
    "/:id",
    protect,
    authorize("SCHOOL_ADMIN"),
    updateDriver
);

router.delete(
    "/:id",
    protect,
    authorize("SCHOOL_ADMIN"),
    deleteDriver
);


module.exports = router;