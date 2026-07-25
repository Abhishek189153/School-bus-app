const bcrypt = require("bcryptjs");

const Trip =require("../models/trip.model");
const Boarding =require("../models/boarding.model");
const Student = require("../models/student.model");
const User = require("../models/user.model");
const Bus = require("../models/bus.model");
const Route = require("../models/route.model");

exports.createSchoolAdmin = async (req, res) => {

    try {

        const {
            name,
            email,
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
            email,
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

exports.getAttendanceHistory =async (req, res) => {

  try {

    const {
      date,
      busId,
      routeId,
    } = req.query;

    const startDate =
      new Date(date);

    startDate.setHours(
      0,0,0,0
    );

    const endDate =
      new Date(date);

    endDate.setHours(
      23,59,59,999
    );

    const tripFilter = {

      schoolId:
        req.user.schoolId,

      createdAt: {
        $gte:
          startDate,

        $lte:
          endDate,
      },

    };

    if (busId) {

      tripFilter.busId =
        busId;

    }

    if (routeId) {

      tripFilter.routeId =
        routeId;

    }

    const trips =
      await Trip.find(
        tripFilter
      );

    const tripIds =
      trips.map(
        trip => trip._id
      );

    const boardingRecords =
      await Boarding.find({

        tripId: {
          $in:
            tripIds,
        },

      });

    const boardedIds =
      boardingRecords.map(
        record =>
          record.studentId.toString()
      );

    const studentFilter = {

      schoolId:
        req.user.schoolId,

    };

    if (busId) {

      studentFilter.busId =
        busId;

    }

    if (routeId) {

      studentFilter.routeId =
        routeId;

    }

    const students =
      await Student.find(
        studentFilter
      )
      .populate(
        "busId",
        "busNumber"
      )
      .populate(
        "routeId",
        "routeName"
      );

    const result =
      students.map(
        student => ({

          _id:
            student._id,

          admissionNumber:
            student.admissionNumber,

          name:
            student.name,

          bus:
            student.busId?.busNumber,

          route:
            student.routeId?.routeName,

          status:
            boardedIds.includes(
              student._id.toString()
            )
            ? "Present"
            : "Absent",

        })
      );

    res.status(200).json({
      success: true,
      students:
        result,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};

exports.getSchoolAdmins = async (req, res) => {

    try {

        const admins = await User.find({
            role: "SCHOOL_ADMIN",
        })
        .populate(
            "schoolId",
            "schoolName"
        )
        .sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            admins,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

exports.getSchoolAdmin = async (req, res) => {

    try {

        const admin = await User.findOne({

            _id: req.params.id,

            role: "SCHOOL_ADMIN",

        }).populate(
            "schoolId",
            "schoolName"
        );

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "School Admin not found",

            });

        }

        res.status(200).json({

            success: true,

            admin,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

exports.updateSchoolAdmin = async (req, res) => {

    try {

        const {

            name,

            email,

            phone,

            schoolId,

        } = req.body;

        const admin = await User.findOneAndUpdate(

            {

                _id: req.params.id,

                role: "SCHOOL_ADMIN",

            },

            {

                name,

                email,

                phone,

                schoolId,

            },

            {

                new: true,

            }

        );

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "School Admin not found",

            });

        }

        res.status(200).json({

            success: true,

            admin,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

exports.deleteSchoolAdmin = async (req, res) => {

    try {

        const admin = await User.findOneAndDelete({

            _id: req.params.id,

            role: "SCHOOL_ADMIN",

        });

        if (!admin) {

            return res.status(404).json({

                success: false,

                message: "School Admin not found",

            });

        }

        res.status(200).json({

            success: true,

            message: "School Admin deleted successfully",

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};