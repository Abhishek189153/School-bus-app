const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {createSchool, getSchools, getSchool, updateSchool, deleteSchool } 
= require("../controllers/school.controller");


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

    router.get(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    getSchool
);

    router.put(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    updateSchool
);

    router.delete(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    deleteSchool
);

module.exports = router;