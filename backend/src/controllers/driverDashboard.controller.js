const User = require("../models/user.model");
const Bus = require("../models/bus.model");
const Route = require("../models/route.model");
const Attendance = require("../models/attendance.model");
const Trip = require("../models/trip.model");

exports.getDriverDashboard = async (req, res) => {
  try {

    const driverId = req.user.id;

    const driver = await User.findById(driverId)
      .select("-password");

    const bus = await Bus.findOne({
      driverId
    });

    let route = null;

    if (bus?.routeId) {
      route = await Route.findById(
        bus.routeId
      );
    }

    const todayAttendance =
      await Attendance.findOne({
        driverId,
      }).sort({
        createdAt: -1,
      });

    const activeTrip =
      await Trip.findOne({
        driverId,
        status: "STARTED",
      });

    res.status(200).json({
      success: true,

      data: {
        driver,
        bus,
        route,
        attendance: todayAttendance,
        activeTrip,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};