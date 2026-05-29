const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} = require("../controllers/student.controller");

router.post(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    createStudent
);

module.exports = router;

router.get(
  "/",
  protect,
  authorize("SCHOOL_ADMIN"),
  getStudents
);

router.get(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  getStudentById
);

router.put(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  updateStudent
);

router.delete(
  "/:id",
  protect,
  authorize("SCHOOL_ADMIN"),
  deleteStudent
);

module.exports = router;