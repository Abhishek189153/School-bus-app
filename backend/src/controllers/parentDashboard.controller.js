const User = require("../models/user.model");
const Student = require("../models/student.model");
const Bus = require("../models/bus.model");
const Route = require("../models/route.model");
const Trip = require("../models/trip.model");
const BusLocation = require("../models/busLocation.model");

exports.getParentDashboard = async (req, res) => {
  try {

    const parentId = req.user.id;

    const student = await Student.findOne({
      parentId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const bus = await Bus.findById(
      student.busId
    );

    let route = null;

    if (bus?.routeId) {
      route = await Route.findById(
        bus.routeId
      );
    }

    const activeTrip =
      await Trip.findOne({
        busId: student.busId,
        status: "STARTED",
      });

    const liveLocation =
      await BusLocation.findOne({
        busId: student.busId,
      });

    res.status(200).json({
      success: true,
      data: {
        student,
        bus,
        route,
        activeTrip,
        liveLocation,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};