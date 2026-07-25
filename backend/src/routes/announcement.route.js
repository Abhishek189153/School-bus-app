const express =
require("express");

const router =
express.Router();

const protect =
require(
  "../middlewares/auth.middleware"
);

const authorize =
require(
  "../middlewares/role.middleware"
);

const {

  createAnnouncement,

  getAnnouncements,

  updateAnnouncement,

  deleteAnnouncement,

} = require(
  "../controllers/announcement.controller"
);

router.post(
  "/",
  protect,
  authorize("SCHOOL_ADMIN"),
  createAnnouncement
);

router.get(
  "/",
  protect,
  getAnnouncements
);

router.put(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  updateAnnouncement
);

router.delete(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  deleteAnnouncement
);

module.exports =
router;