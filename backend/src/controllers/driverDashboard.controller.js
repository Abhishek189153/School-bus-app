const User = require("../models/user.model");
const Bus = require("../models/bus.model");
const Route = require("../models/route.model");
const Attendance = require("../models/attendance.model");
const Trip = require("../models/trip.model");

exports.getDriverDashboard = async (req, res) => {
  try {

    const driverId = req.user.id;

    // ==========================================
    // FIND DRIVER
    // ==========================================

    const driver =
      await User.findById(driverId)
        .select("-password");

    if (!driver) {

      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });

    }

    // ==========================================
    // FIND DRIVER'S BUS
    // ==========================================

    const bus =
      await Bus.findOne({
        driverId,
        schoolId:
          req.user.schoolId,
      });

    if (!bus) {

      return res.status(404).json({
        success: false,
        message:
          "No bus assigned to driver",
      });

    }

    // ==========================================
    // INDIA DATE
    // ==========================================

    const now =
      new Date(
        new Date().toLocaleString(
          "en-US",
          {
            timeZone:
              "Asia/Kolkata",
          }
        )
      );

    const today =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}`;

    // ==========================================
    // PRIMARY ROUTE
    // ==========================================

    let route = null;

    if (bus.routeId) {

      route =
        await Route.findById(
          bus.routeId
        );

    }

    // ==========================================
    // DRIVER ATTENDANCE
    // ==========================================

    const todayAttendance =
      await Attendance.findOne({

        driverId,

        schoolId:
          req.user.schoolId,

        tripDate:
          today,

      });

    // ==========================================
    // DUTY STATUS
    // ==========================================

    let dutyStatus = "OFF";
    let dutySince = null;

    if (
      todayAttendance?.dutyOnTime &&
      !todayAttendance?.dutyOffTime
    ) {

      dutyStatus = "ON";

      dutySince =
        todayAttendance.dutyOnTime;

    }

    // ==========================================
    // ACTIVE TRIP
    // ==========================================
    //
    // IMPORTANT:
    // Only an actual STARTED trip is active.
    //
    // We do NOT create a fake ACTIVE_BY_TIME trip.
    //
    // ==========================================

    const activeTrip =
      await Trip.findOne({

        driverId,

        busId:
          bus._id,

        status:
          "STARTED",

      })

      .populate(
        "routeId",
        "routeName scheduledTime tripType"
      )

      .sort({
        startTime: -1,
      });

    // ==========================================
    // LOGS
    // ==========================================

    console.log(
      "================================="
    );

    console.log(
      "DRIVER DASHBOARD"
    );

    console.log(
      "Driver:",
      driver.name
    );

    console.log(
      "Bus:",
      bus.busNumber
    );

    console.log(
      "Today:",
      today
    );

    console.log(
      "Attendance:",
      todayAttendance
    );

    console.log(
      "Duty Status:",
      dutyStatus
    );

    console.log(
      "Duty Since:",
      dutySince
    );

    console.log(
      "Active Trip:",
      activeTrip
    );

    console.log(
      "Primary Route:",
      route?.routeName
    );

    console.log(
      "================================="
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({

      success: true,

      data: {

        driver,

        bus,

        route,

        attendance:
          todayAttendance,

        // ======================================
        // DUTY
        // ======================================

        duty: {

          status:
            dutyStatus,

          since:
            dutySince,

        },

        // ======================================
        // ACTIVE TRIP
        // ======================================

        activeTrip,

      },

    });

  } catch (error) {

    console.error(
      "DRIVER DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }
};