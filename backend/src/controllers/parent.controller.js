const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Student = require("../models/student.model");
const Bus = require("../models/bus.model");
const Trip = require("../models/trip.model");
const BusLocation = require("../models/busLocation.model");
const Route = require("../models/route.model");


exports.createParent = async (req, res) => {

    try {

        const {
            name,
            phone,
            password,
        } = req.body;

        const existingUser =
            await User.findOne({
                phone,
            });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message:
                    "Another user already has the same number",
            });

        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const parent =
            await User.create({
                name,
                phone,
                password:
                    hashedPassword,
                role:
                    "PARENT",
                schoolId:
                    req.user.schoolId,
            });

        const parentResponse =
            parent.toObject();

        delete parentResponse.password;

        res.status(201).json({
            success: true,
            parent:
                parentResponse,
        });

    } catch (error) {

        console.log(
            "CREATE PARENT ERROR:",
            error
        );

        if (
            error.code === 11000
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Another user already has the same number",
            });

        }

        res.status(500).json({
            success: false,
            message:
                error.message,
        });

    }

};

exports.getParents = async (req, res) => {

    try {

       const parents =
        await User.find({
            schoolId: req.user.schoolId,
            role: "PARENT",
        }).select("-password");

        const parentsWithStudents =
        await Promise.all(
            parents.map(
            async (parent) => {

                const students =
                    await Student.find({
                        parentId: parent._id,
                    });

                    return {
                    ...parent.toObject(),
                    studentName:
                        students.length > 0
                        ? students
                            .map(
                                (student) =>
                                `${student.name}(${student.admissionNumber})`
                            )
                            .join(", ")
                        : "N/A",
                    };
            }
            )
        );

        res.status(200).json({
        success: true,
        parents: parentsWithStudents,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getParentById = async (req, res) => {

    try {

        const parent =
            await User.findById(
                req.params.id
            ).select("-password");

        if (!parent) {

            return res.status(404).json({
                success: false,
                message: "Parent not found",
            });

        }

        if (
            parent.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        res.status(200).json({
            success: true,
            parent,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.updateParent = async (req, res) => {

    try {

        const parent =
            await User.findById(
                req.params.id
            );

        if (!parent) {

            return res.status(404).json({
                success: false,
                message:
                    "Parent not found",
            });

        }

        if (
            parent.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Access denied",
            });

        }

        // Check duplicate phone
        if (req.body.phone) {

            const existingUser =
                await User.findOne({
                    phone:
                        req.body.phone,
                    _id: {
                        $ne:
                            req.params.id,
                    },
                });

            if (existingUser) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Another user already has the same number",
                });

            }

        }

        const updatedParent =
            await User.findByIdAndUpdate(
                req.params.id,
                {
                    name:
                        req.body.name,
                    phone:
                        req.body.phone,
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).select("-password");

        res.status(200).json({
            success: true,
            parent:
                updatedParent,
        });

    } catch (error) {

        console.log(
            "UPDATE PARENT ERROR:",
            error
        );

        if (
            error.code === 11000
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Another user already has the same number",
            });

        }

        res.status(500).json({
            success: false,
            message:
                error.message,
        });

    }

};

exports.deleteParent = async (req, res) => {

    try {

        const parent =
            await User.findById(
                req.params.id
            );

        if (!parent) {

            return res.status(404).json({
                success: false,
                message: "Parent not found",
            });

        }

        if (
            parent.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        await User.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message:
                "Parent deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


exports.getParentDashboard =
async (req, res) => {

  console.log(
    "Parent Dashboard File Hit"
  );

  try {

    const parent =
      await User.findById(
        req.user.id
      );

    const students =
      await Student.find({
        parentId: parent._id,
      })
      .populate(
        "busId",
        "busNumber driverId"
      )
      .populate(
        "routeId",
        "routeName"
      );

    if (
      !students.length
    ) {

      return res.status(404).json({
        success: false,
        message:
          "No student found",
      });

    }

    const firstStudent =
      students[0];

    const bus =
      await Bus.findById(
        firstStudent.busId._id
      ).populate(
        "driverId",
        "name phone",
      );

    const activeTrip =
      await Trip.findOne({
        busId:
          firstStudent.busId._id,

        status:
          "STARTED",
      });

    const liveLocation =
      await BusLocation.findOne({
        busId:
          firstStudent.busId._id,
      });

    const route =
      await Route.findById(
        firstStudent.routeId._id
      );

    let approachingStop =
      null;

    if (
      activeTrip &&
      route &&
      route.stops?.length &&
      liveLocation
    ) {

      let nearestDistance =
        Number.MAX_VALUE;

      route.stops.forEach(
        (stop) => {

          const distance =
            Math.sqrt(
              Math.pow(
                stop.latitude -
                liveLocation.latitude,
                2
              ) +
              Math.pow(
                stop.longitude -
                liveLocation.longitude,
                2
              )
            );

          if (
            distance <
            nearestDistance
          ) {

            nearestDistance =
              distance;

            approachingStop =
              stop.stopName;

          }

        }
      );

    }

    console.log(
      "ACTIVE TRIP:",
      activeTrip
    );

    console.log(
      "APPROACHING STOP:",
      approachingStop
    );

    res.status(200).json({

      success: true,

      boardingStatus:
  students.map(
    (student) => ({
      name:
        student.name,

      boardedToday:
        student.boardedToday,
    })
  ),

      studentName:
        firstStudent.name,

      routeName:
        firstStudent.routeId?.routeName,

      pickupStop:
        firstStudent.pickupStop,

      busNumber:
        bus.busNumber,

      vehicleNumber:
        bus.vehicleNumber,

      driverName:
        bus.driverId?.name,

      driverPhone:
        bus.driverId?.phone,

      totalStudents:
        students.length,

      students,

      activeTrip,

      liveLocation,

      approachingStop,

       boardedToday: firstStudent.boardedToday,

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};