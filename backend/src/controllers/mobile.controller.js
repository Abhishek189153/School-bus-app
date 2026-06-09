const Bus = require("../models/bus.model");
const Trip = require("../models/trip.model");
const Student = require("../models/student.model");
const Boarding =require("../models/boarding.model");
const Route =require("../models/route.model");
const BusRoute =require("../models/busRoute.model");
const Attendance =require("../models/attendance.model");
const StudentAttendance =require("../models/studentAttendance.model");
const BusLocation = require("../models/busLocation.model");


exports.getDriverDashboard = async (req, res) => {
  try {

    const bus = await Bus.findOne({
      driverId: req.user.id,
      schoolId: req.user.schoolId,
    }).populate("routeId")
    .populate(
  "driverId",
  "name phone"
);


    const activeTrip = await Trip.findOne({
      driverId: req.user.id,
      status: "STARTED",
    });

   

    res.status(200).json({
      success: true,
      bus,
      activeTrip,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.startTrip = async (
  req,
  res
) => {
  try {

    const {
      tripType,
      routeId,
    } = req.body;

    const bus =
      await Bus.findOne({
        driverId:
          req.user.id,

        schoolId:
          req.user.schoolId,
      });

    if (!bus) {

      return res.status(404).json({
        success: false,
        message:
          "No bus assigned",
      });

    }

    const existingTrip =
  await Trip.findOne({
    driverId:
      req.user.id,

    status:
      "STARTED",

    routeId,

    tripType,
  });

if (existingTrip) {

  return res.status(200).json({
    success: true,
    trip:
      existingTrip,
  });

}

    const trip =
      await Trip.create({
        schoolId:
          req.user.schoolId,

        busId:
          bus._id,

        routeId,

        driverId:
          req.user.id,

        tripType,

        startTime:
          new Date(),

        status:
          "STARTED",
      });

    res.status(201).json({
      success: true,
      trip,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

exports.endTrip = async (
  req,
  res
) => {
  try {

    const trip =
      await Trip.findById(
        req.params.tripId
      );

    if (!trip) {

      return res.status(404).json({
        success: false,
        message:
          "Trip not found",
      });

    }

    const students =
      await Student.find({

        busId:
          trip.busId,

        routeId:
          trip.routeId,

      });

    const boardedStudents =
      await Boarding.find({

        tripId:
          trip._id,

      });

    const boardedIds =
      boardedStudents.map(
        (item) =>
          item.studentId.toString()
      );

    const existingAttendance =
      await StudentAttendance.findOne({
        tripId:
          trip._id,
      });

    if (!existingAttendance) {

      const attendanceRecords =
        students.map(
          (student) => ({

            studentId:
              student._id,

            tripId:
              trip._id,

            tripType:
              trip.tripType,

            busId:
              trip.busId,

            routeId:
              trip.routeId,

            schoolId:
              trip.schoolId,

            attendanceDate:
              new Date(),

            status:
              boardedIds.includes(
                student._id.toString()
              )
                ? "PRESENT"
                : "ABSENT",

          })
        );

      await StudentAttendance.insertMany(
        attendanceRecords
      );

    }

    trip.endTime =
      new Date();

    trip.status =
      "COMPLETED";

    await trip.save();

    res.status(200).json({

      success: true,

      message:
        "Trip Completed",

      totalStudents:
        students.length,

      present:
        boardedIds.length,

      absent:
        students.length -
        boardedIds.length,

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};


exports.getTripStudents = async (
  req,
  res
) => {
  try {

    console.log(
  "Received Trip ID:",
  req.params.tripId
);

    const tripId =
      req.params.tripId;

    const activeTrip =
      await Trip.findById(
        tripId
      );

     console.log(
  "Trip Found:",
  activeTrip
);

    console.log(
      "Trip Bus ID:",
      activeTrip.busId
    );

    if (!activeTrip) {

      return res.status(404).json({
        success: false,
        message:
          "No active trip found",
      });

    }

    const students =
      await Student.find({

        busId:
          activeTrip.busId,

        routeId:
          activeTrip.routeId,

      });


      console.log(
  "Students Found:",
  students.length
);

    res.status(200).json({
      success: true,
      students,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};


exports.boardStudent = async (
  req,
  res
) => {
  try {

    const {
      tripId,
      studentId,
    } = req.body;

    const existingBoarding =
      await Boarding.findOne({
        tripId,
        studentId,
      });

    if (existingBoarding) {
      return res.status(400).json({
        success: false,
        message:
          "Student already boarded",
      });
    }

    const boarding =
      await Boarding.create({
        tripId,
        studentId,
      });

    res.status(201).json({
      success: true,
      message:
        "Student boarded successfully",
      boarding,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};


exports.unboardStudent = async (
  req,
  res
) => {
  try {

    const {
      tripId,
      studentId,
    } = req.body;

    await Boarding.findOneAndDelete({
      tripId,
      studentId,
    });

    res.status(200).json({
      success: true,
      message:
        "Student unboarded successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};


exports.tripSummary = async (
  req,
  res
) => {
  try {

    const tripId =
      req.params.tripId;

    const trip =
      await Trip.findById(
        tripId
      )
      .populate("driverId")
      .populate("busId");

    const bus =
    await Bus.findById(
      trip.busId._id
    );

    const route =
      await Route.findById(
        trip.routeId
      );

    const students =
    await Student.find({
      busId: trip.busId,
      routeId: trip.routeId,
    });

    const boardedRecords =
      await Boarding.find({
        tripId,
      }).populate(
        "studentId"
      );

    const boardedStudents =
      boardedRecords.map(
        (record) => ({
          _id:
            record.studentId._id,
          name:
            record.studentId.name,
        })
      );

    const boardedIds =
      boardedStudents.map(
        (student) =>
          student._id.toString()
      );

    const absentStudents =
      students
        .filter(
          (student) =>
            !boardedIds.includes(
              student._id.toString()
            )
        )
        .map(
          (student) => ({
            _id:
              student._id,
            name:
              student.name,
          })
        );

    res.status(200).json({
      success: true,

      driverName:
        trip.driverId.name,

      busNumber:
        bus.busNumber,

      routeName:
      route?.routeName,

      totalStudents:
        students.length,

      totalBoarded:
        boardedStudents.length,

      absent:
        absentStudents.length,

      boardedStudents,

      absentStudents,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

exports.tripHistory = async (
  req,
  res
) => {
  try {

    const trips =
      await Trip.find({
        driverId:
          req.user.id,
      })
      .populate(
        "routeId",
        "routeName"
      )
      .populate(
        "busId",
        "busNumber"
      )
      .sort({
        createdAt: -1,
      });

    const history =
      await Promise.all(

        trips.map(
          async (trip) => {

            const boarded =
              await Boarding.countDocuments({
                tripId:
                  trip._id,
              });

            const totalStudents =
              await Student.countDocuments({

                busId:
                  trip.busId._id,

                routeId:
                  trip.routeId._id,

              });

            return {

              _id:
                trip._id,

              tripType:
                trip.tripType,

              routeName:
                trip.routeId
                  ?.routeName,

              busNumber:
                trip.busId
                  ?.busNumber,

              date:
                trip.createdAt,

              boarded,

              absent:
                Math.max(
                  0,
                  totalStudents -
                  boarded
                ),

              status:
                trip.status,

            };

          }
        )

      );

    res.status(200).json({
      success: true,
      history,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

exports.dutyOn = async (req, res) => {
  try {
    const existing = await Attendance.findOne({
      driverId: req.user.id,
      status: "ON_DUTY",
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Already On Duty",
      });
    }

    const attendance = await Attendance.create({
      driverId: req.user.id,
      schoolId: req.user.schoolId,
      dutyOnTime: new Date(),
      status: "ON_DUTY",
    });

    res.status(201).json({
      success: true,
      attendance,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.dutyOff = async (
  req,
  res
) => {
  try {

    const attendance =
      await Attendance.findOne({
        driverId:
          req.user.id,

        status:
          "ON_DUTY",
      });

    if (!attendance) {

      return res.status(404).json({
        success: false,
        message:
          "No Active Duty",
      });

    }

    attendance.status =
      "OFF_DUTY";

    attendance.dutyOffTime =
      new Date();

    await attendance.save();

    res.status(200).json({
      success: true,
      message:
        "Duty Off Successful",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

exports.getAssignedRoutes =
  async (req, res) => {

    try {

      const bus =
        await Bus.findOne({
          driverId:
            req.user.id,
          schoolId:
            req.user.schoolId,
        }).populate("routeId");

      if (!bus) {

        return res.status(404).json({
          success: false,
          message:
            "Bus not assigned",
        });

      }

      const extraRoutes =
        await BusRoute.find({
          busId: bus._id,
        }).populate("routeId");

      const routes = [];

      // Primary Route
      if (bus.routeId) {

        routes.push({
            _id:
                bus.routeId._id,

            routeName:
                bus.routeId.routeName,

            pickupRoute:
                bus.routeId.stops
                ?.map(
                    stop =>
                    stop.stopName
                )
                .join(" → "),

            dropRoute:
                [...bus.routeId.stops]
                .reverse()
                .map(
                    stop =>
                    stop.stopName
                )
                .join(" → "),
            });

      }

      // Additional Routes
      extraRoutes.forEach(
        (item) => {

        routes.push({
            _id:
                item.routeId._id,

            routeName:
                item.routeId.routeName,

            pickupRoute:
                item.routeId.stops
                ?.map(
                    stop =>
                    stop.stopName
                )
                .join(" → "),

            dropRoute:
                [...item.routeId.stops]
                .reverse()
                .map(
                    stop =>
                    stop.stopName
                )
                .join(" → "),
            });

        }
      );


      const activeTrips =
      await Trip.find({
        driverId:
          req.user.id,

        status:
          "STARTED",
      });

    const activeRouteIds =
      activeTrips.map(
        (trip) =>
          trip.routeId.toString()
      );


      res.status(200).json({
        success: true,
        busNumber:
          bus.busNumber,
        routes,
        activeRouteIds,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };


exports.getDutyStatus =
  async (req, res) => {

    try {

      const attendance =
        await Attendance.findOne({
          driverId:
            req.user.id,

          status:
            "ON_DUTY",
        });

      res.status(200).json({
        success: true,
        onDuty:
          !!attendance,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };


exports.getBoardedStudents =
  async (req, res) => {

    try {

      const boarded =
        await Boarding.find({
          tripId:
            req.params.tripId,
        });

      res.status(200).json({
        success: true,

        boardedStudents:
          boarded.map(
            item =>
              item.studentId.toString()
          ),
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

 

exports.getMyBusLocation =
async (req, res) => {


   console.log(
    "GET MY BUS LOCATION HIT"
  );

  try {

    const student =
      await Student.findOne({
        parentId:
          req.user.id,
      });

    if (!student) {

      return res.status(404).json({
        success: false,
        message:
          "Student not found",
      });

    }

    const location =
      await BusLocation.findOne({
        busId:
          student.busId,
      });

    res.status(200).json({

      success: true,

      busId:
        student.busId,

      routeId:
        student.routeId,

      location,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};