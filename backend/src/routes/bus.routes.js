const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createBus,
    getBuses,
    getBusById,
    updateBus,
    deleteBus,
    getBusOverview
} = require("../controllers/bus.controller");

console.log("===== BUS ROUTE HANDLERS =====");
console.log("createBus:", typeof createBus);
console.log("getBuses:", typeof getBuses);
console.log("getBusById:", typeof getBusById);
console.log("updateBus:", typeof updateBus);
console.log("deleteBus:", typeof deleteBus);
console.log("getBusOverview:", typeof getBusOverview);
console.log("protect:", typeof protect);
console.log("authorize:", typeof authorize);
console.log("==============================");

router.post(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    createBus
);

router.get(
    "/overview",
    protect,
    authorize("SCHOOL_ADMIN"),
    getBusOverview
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