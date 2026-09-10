const User = require("../models/user.model");
const Bus = require("../models/bus.model");
const Route = require("../models/route.model");
const Attendance = require("../models/attendance.model");
const Trip = require("../models/trip.model");

exports.getDriverDashboard = async (req, res) => {
  try {

    const driverId =
      req.user.id;

    const schoolId =
      req.user.schoolId;

    // ==========================================
    // FIND DRIVER
    // ==========================================

    const driver =
      await User.findById(
        driverId
      ).select("-password");

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
        schoolId,
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

    const indiaNow =
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
      `${indiaNow.getFullYear()}-${String(
        indiaNow.getMonth() + 1
      ).padStart(2, "0")}-${String(
        indiaNow.getDate()
      ).padStart(2, "0")}`;

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
      "Today:",
      today
    );

    // ==========================================
    // CLOSE OLD UNFINISHED TRIPS
    // ==========================================
    //
    // IMPORTANT:
    // If yesterday's trip was left STARTED,
    // it must NOT remain an active trip today.
    //
    // We do NOT delete it.
    //
    // We simply mark it COMPLETED so it remains
    // available in Trip History.
    //
    // ==========================================

    const oldTripsResult =
      await Trip.updateMany(

        {
          driverId,

          busId:
            bus._id,

          status:
            "STARTED",

          tripDate: {
            $ne:
              today,
          },

        },

        {
          $set: {
            status:
              "COMPLETED",

            endTime:
              new Date(),
          },
        }

      );

    console.log(
      "OLD STARTED TRIPS CLOSED:",
      oldTripsResult.modifiedCount
    );

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
    // TODAY'S DRIVER ATTENDANCE
    // ==========================================

    const todayAttendance =
      await Attendance.findOne({

        driverId,

        schoolId,

        tripDate:
          today,

      });

    // ==========================================
    // DUTY STATUS
    // ==========================================

    let dutyStatus =
      "OFF";

    let dutySince =
      null;

    if (
      todayAttendance?.dutyOnTime &&
      !todayAttendance?.dutyOffTime
    ) {

      dutyStatus =
        "ON";

      dutySince =
        todayAttendance.dutyOnTime;

    }

    // ==========================================
    // FIND TODAY'S ACTIVE TRIP ONLY
    // ==========================================

    const activeTrip =
      await Trip.findOne({

        driverId,

        schoolId,

        busId:
          bus._id,

        tripDate:
          today,

        status:
          "STARTED",

      })

      .populate(
        "routeId",
        "routeName scheduledTime tripType"
      )

      .sort({
        startTime:
          -1,
      });

    // ==========================================
    // LOGS
    // ==========================================

    console.log(
      "Today's active trip:"
    );

    if (activeTrip) {

      console.log({
        id:
          activeTrip._id,

        tripDate:
          activeTrip.tripDate,

        tripType:
          activeTrip.tripType,

        status:
          activeTrip.status,

        route:
          activeTrip.routeId?.routeName,

      });

    } else {

      console.log(
        "NO ACTIVE TRIP FOR TODAY"
      );

    }

    console.log(
      "Duty Status:",
      dutyStatus
    );

    console.log(
      "Duty Since:",
      dutySince
    );

    console.log(
      "================================="
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({

      success:
        true,

      data: {

        driver,

        bus,

        route,

        attendance:
          todayAttendance,

        duty: {

          status:
            dutyStatus,

          since:
            dutySince,

        },

        activeTrip:
          activeTrip || null,

      },

    });

  } catch (error) {

    console.error(
      "DRIVER DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({

      success:
        false,

      message:
        error.message,

    });

  }
};