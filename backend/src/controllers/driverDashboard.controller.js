const User = require("../models/user.model");
const Bus = require("../models/bus.model");
const Route = require("../models/route.model");
const Attendance = require("../models/attendance.model");
const Trip = require("../models/trip.model");


// ======================================================
// GET DRIVER DASHBOARD
// ======================================================

exports.getDriverDashboard = async (req, res) => {

  try {

    const driverId =
      req.user.id;


    // ==================================================
    // FIND DRIVER
    // ==================================================

    const driver =
      await User.findById(
        driverId
      ).select("-password");


    if (!driver) {

      return res.status(404).json({

        success: false,

        message:
          "Driver not found",

      });

    }


    // ==================================================
    // FIND DRIVER'S BUS
    // ==================================================

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


    // ==================================================
    // INDIA DATE
    // ==================================================
    //
    // This gives today's date according to India.
    //
    // Example:
    // 2026-08-20
    //
    // ==================================================

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


    // ==================================================
    // PRIMARY ROUTE
    // ==================================================

    let route = null;


    if (bus.routeId) {

      route =
        await Route.findById(
          bus.routeId
        );

    }


    // ==================================================
    // DRIVER ATTENDANCE FOR TODAY
    // ==================================================

    const todayAttendance =
      await Attendance.findOne({

        driverId,

        schoolId:
          req.user.schoolId,

        tripDate:
          today,

      });


    // ==================================================
    // DUTY STATUS
    // ==================================================
    //
    // ON:
    // Driver has started duty today
    // and has NOT completed the last route yet.
    //
    // OFF:
    // No duty started today
    // OR duty has already ended today.
    //
    // ==================================================

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


    // ==================================================
    // ACTIVE TRIP
    // ==================================================
    //
    // VERY IMPORTANT:
    //
    // We check BOTH:
    //
    // status = STARTED
    //
    // AND
    //
    // tripDate = TODAY
    //
    // Therefore a trip left STARTED yesterday
    // will NOT appear as today's active trip.
    //
    // ==================================================

    const activeTrip =
      await Trip.findOne({

        driverId,

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


    // ==================================================
    // LOGS
    // ==================================================

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
      "Today's Active Trip:",
      activeTrip
    );

    console.log(
      "Primary Route:",
      route?.routeName
    );

    console.log(
      "================================="
    );


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({

      success: true,

      data: {

        // ----------------------------------------------
        // DRIVER
        // ----------------------------------------------

        driver,


        // ----------------------------------------------
        // BUS
        // ----------------------------------------------

        bus,


        // ----------------------------------------------
        // PRIMARY ROUTE
        // ----------------------------------------------

        route,


        // ----------------------------------------------
        // TODAY'S ATTENDANCE
        // ----------------------------------------------

        attendance:
          todayAttendance,


        // ----------------------------------------------
        // DUTY
        // ----------------------------------------------

        duty: {

          status:
            dutyStatus,

          since:
            dutySince,

        },


        // ----------------------------------------------
        // TODAY'S ACTIVE TRIP
        // ----------------------------------------------

        activeTrip:
          activeTrip || null,


        // ----------------------------------------------
        // TODAY
        // ----------------------------------------------

        todayTripDate:
          today,

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