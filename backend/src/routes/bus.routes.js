const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createBus,
    getBuses,
    getBusById,
    updateBus,
    deleteBus
} = require("../controllers/bus.controller");

router.post(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    createBus
);

router.get(
  "/",
  protect,
  authorize("SCHOOL_ADMIN"),
  getBuses
);

router.get(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  getBusById
);

router.post(
  "/",
  protect,
  authorize("SCHOOL_ADMIN"),
  createBus
);

router.put(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  updateBus
);

router.delete(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  deleteBus
);

module.exports = router;