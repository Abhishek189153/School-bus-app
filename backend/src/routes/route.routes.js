const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createRoute,
    getRoutes,
    getRouteById,
    updateRoute,
    deleteRoute
} = require("../controllers/route.controller");

router.post(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    createRoute
);

router.get(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    getRoutes
);

router.get(
    "/:id",
    protect,
    authorize("SCHOOL_ADMIN"),
    getRouteById
);


router.put(
    "/:id",
    protect,
    authorize("SCHOOL_ADMIN"),
    updateRoute
);

router.delete(
    "/:id",
    protect,
    authorize("SCHOOL_ADMIN"),
    deleteRoute
);

module.exports = router;