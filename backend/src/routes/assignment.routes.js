const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    assignDriverToBus,
    assignStudentToBus,
    assignRouteToBus,
    unassignDriverFromBus,
    unassignRouteFromBus,
    getBusesByRoute
} = require("../controllers/assignment.controller");

router.put(
    "/assign-driver",
    protect,
    authorize("SCHOOL_ADMIN"),
    assignDriverToBus
);

router.put(
    "/assign-student",
    protect,
    authorize("SCHOOL_ADMIN"),
    assignStudentToBus
);

router.put(
  "/assign-route",
  protect,
  authorize("SCHOOL_ADMIN"),
  assignRouteToBus
);

router.put(
    "/unassign-driver",
    protect,
    authorize(
        "SCHOOL_ADMIN"
    ),
    unassignDriverFromBus
);

router.put(
    "/unassign-route",
    protect,
    authorize(
        "SCHOOL_ADMIN"
    ),
    unassignRouteFromBus
);

router.get(
  "/route-buses/:routeId",
  protect,
    authorize(
        "SCHOOL_ADMIN"
    ),
    getBusesByRoute
);

module.exports = router;