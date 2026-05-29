const bcrypt = require("bcryptjs");

// const User = require("../models/user.model");

const Student = require("../models/student.model");
const User = require("../models/user.model");
const Bus = require("../models/bus.model");
const Route = require("../models/route.model");

exports.createSchoolAdmin = async (req, res) => {

    try {

        const {
            name,
            phone,
            password,
            schoolId
        } = req.body;

        const existingUser = await User.findOne({ phone });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name,
            phone,
            password: hashedPassword,
            role: "SCHOOL_ADMIN",
            schoolId
        });

        res.status(201).json({
            success: true,
            admin
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getDashboardStats = async (req, res) => {
  try {

    const schoolId = req.user.schoolId;

    const students = await Student.countDocuments({
      schoolId,
    });

    const drivers = await User.countDocuments({
      schoolId,
      role: "DRIVER",
    });

    const parents = await User.countDocuments({
      schoolId,
      role: "PARENT",
    });

    const buses = await Bus.countDocuments({
      schoolId,
    });

    const routes = await Route.countDocuments({
      schoolId,
    });

    res.status(200).json({
      success: true,
      data: {
        students,
        drivers,
        parents,
        buses,
        routes,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};