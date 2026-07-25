const School = require("../models/school.model");
const User = require("../models/user.model");
const Student = require("../models/student.model");
const Bus = require("../models/bus.model");

exports.getDashboard = async (req, res) => {

  try {

    const totalSchools =
      await School.countDocuments();

    const totalAdmins =
      await User.countDocuments({
        role: "SCHOOL_ADMIN",
      });

    const totalStudents =
      await Student.countDocuments();

    const totalBuses =
      await Bus.countDocuments();

    const recentSchools =
      await School.find()
      .sort({
        createdAt: -1,
      })
      .limit(5);

    res.json({

      success: true,

      totalSchools,

      totalAdmins,

      totalStudents,

      totalBuses,

      recentSchools,

    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};