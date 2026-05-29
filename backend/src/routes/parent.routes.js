const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createParent,
    getParents,
    getParentById,
    updateParent,
    deleteParent
} = require("../controllers/parent.controller");

router.post(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    createParent
);

router.get(
  "/",
  protect,
  authorize("SCHOOL_ADMIN"),
  getParents
);

router.get(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  getParentById
);

router.put(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  updateParent
);

router.delete(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  deleteParent
);

module.exports = router;