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

    let activeTrip =
  await Trip.findOne({
    driverId,
    status: "STARTED",
  });

if (!activeTrip && bus?.routeId) {

  const route =
    await Route.findById(
      bus.routeId
    );

  if (
    route?.scheduledTime
  ) {

    const now =
      new Date();

    const [hour, minute] =
      route.scheduledTime
        .split(":")
        .map(Number);

    const tripTime =
      new Date();

    tripTime.setHours(
      hour,
      minute,
      0,
      0
    );

    const diffMinutes =
      (
        tripTime - now
      ) /
      1000 /
      60;

    // Same ACTIVE logic used in Routes page
    if (
      diffMinutes <= 30
    ) {

      activeTrip = {
        _id: "TIME_ACTIVE",
        status: "ACTIVE_BY_TIME",
      };

    }

  }

}

console.log(
  "DASHBOARD ACTIVE TRIP:",
  activeTrip
);

console.log(
  "BUS:",
  bus?.busNumber
);

console.log(
  "ROUTE:",
  route?.routeName
);

console.log(
  "SCHEDULED:",
  route?.scheduledTime
);

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