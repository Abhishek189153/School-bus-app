const StudentAttendance = require("../models/studentAttendance.model");
const Attendance = require("../models/attendance.model");
const Trip = require("../models/trip.model");
const User = require("../models/user.model");
const Bus = require("../models/bus.model");


exports.getAttendanceHistory =
async (req, res) => {

  try {

    const {
      date,
      busId,
      routeId,
      search,
      tripType,
    } = req.query;

    const filter = {
      schoolId:
        req.user.schoolId,
    };

    if (date) {

      const start =
        new Date(date);

      start.setHours(
        0,0,0,0
      );

      const end =
        new Date(date);

      end.setHours(
        23,59,59,999
      );

      filter.attendanceDate = {
        $gte: start,
        $lte: end,
      };

    }

    if (busId) {

      filter.busId =
        busId;

    }

    if (routeId) {

      filter.routeId =
        routeId;

    }

    if (tripType) {
      filter.tripType =
        tripType;
    }

    const attendance =
await StudentAttendance.find(
  filter
)
.populate(
  "studentId",
  "name admissionNumber"
)
.populate(
  "busId",
  "busNumber"
)
.populate(
  "routeId",
  "routeName"
);

    let filteredAttendance =
attendance;

if (search) {

  filteredAttendance =
    attendance.filter(
      (item) =>
        item.studentId?.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      ||

      item.studentId?.admissionNumber
        ?.toString()
        .includes(search)
    );

}

     const presentCount =
  filteredAttendance.filter(
    item =>
      item.status ===
      "PRESENT"
  ).length;

const absentCount =
  filteredAttendance.filter(
    item =>
      item.status ===
      "ABSENT"
  ).length;

    res.status(200).json({
      success: true,
       total:filteredAttendance.length,

  present: presentCount,

  absent: absentCount,

  attendance:
  filteredAttendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};

exports.getDriverAttendanceHistory =
async (req, res) => {


  try {

    const { date, busId, search, } = req.query;

    const selectedDate =
  date
    ? new Date(date)
    : new Date();

const startDate =
  new Date(selectedDate);

startDate.setHours(
  0,0,0,0
);

const endDate =
  new Date(selectedDate);

endDate.setHours(
  23,59,59,999
);

   const driverFilter = {

  schoolId:
    req.user.schoolId,

  role:
    "DRIVER",

};

if (search) {

  driverFilter.$or = [

    {
      name: {
        $regex: search,
        $options: "i",
      },
    },

    {
      phone: {
        $regex: search,
        $options: "i",
      },
    },

  ];

}

const drivers =
  await User.find(
    driverFilter
  );
    const result =
      await Promise.all(

        drivers.map(
          async (
            driver
          ) => {

            const bus =
              await Bus.findOne({
                driverId:
                  driver._id,
              });

              if (
                busId &&
                bus?._id.toString() !==
                  busId
              ) {

                return null;

              }

            const attendance =
              await Attendance.findOne({

                driverId:
                  driver._id,

                dutyOnTime: {
                  $gte:
                    startDate,

                  $lte:
                    endDate,
                },

              });

            const completedTrips =
              await Trip.countDocuments({

                driverId:
                  driver._id,

                status:
                  "COMPLETED",

                createdAt: {
                  $gte:
                    startDate,

                  $lte:
                    endDate,
                },

              });

            const isPresent =

              attendance &&

              completedTrips > 0;

            return {

              _id:
                driver._id,

              name:
                driver.name,

              phone:
                driver.phone,

               busNumber:
                  bus?.busNumber ||
                  "-",

              dutyOnTime:
                attendance
                  ?.dutyOnTime,

              dutyOffTime:
                attendance
                  ?.dutyOffTime,

              completedTrips,

              status:
                isPresent
                  ? "PRESENT"
                  : "ABSENT",

            };

          }
        )
      );

    const filteredResult =
      result.filter(Boolean);

    res.status(200).json({

      success: true,

      total:
        filteredResult.length,

      present:
        filteredResult.filter(
          r =>
            r.status ===
            "PRESENT"
        ).length,

      absent:
        filteredResult.filter(
          r =>
            r.status ===
            "ABSENT"
        ).length,

      drivers:
        filteredResult,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};