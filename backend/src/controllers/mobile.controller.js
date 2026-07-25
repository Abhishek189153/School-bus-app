const Bus = require("../models/bus.model");
const Trip = require("../models/trip.model");
const Student = require("../models/student.model");
const Boarding =require("../models/boarding.model");
const Route =require("../models/route.model");
const BusRoute =require("../models/busRoute.model");
const Attendance =require("../models/attendance.model");
const StudentAttendance =require("../models/studentAttendance.model");
const BusLocation = require("../models/busLocation.model");
const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const bcrypt = require("bcryptjs");
const {sendOTP,} = require("../services/sms.service");
const {sendNotification} = require("../services/pushNotification.service");



exports.getDriverDashboard = async (req, res) => {
  try {

    const bus = await Bus.findOne({
      driverId: req.user.id,
      schoolId: req.user.schoolId,
    })
      .populate("routeId")
      .populate(
        "driverId",
        "name phone"
      );

    const activeTrip = await Trip.findOne({
      driverId: req.user.id,
      status: "STARTED",
    });

    // let activeRoutesCount = 0;

    // if (bus) {

    //   const now = new Date();

    //   const routesToCheck = [];

    //   // Primary Route
    //   if (bus.routeId) {

    //     routesToCheck.push(
    //       bus.routeId
    //     );

    //   }

    //   // Additional Routes
    //   const extraRoutes =
    //     await BusRoute.find({
    //       busId: bus._id,
    //     }).populate("routeId");

    //   extraRoutes.forEach(
    //     (item) => {

    //       if (
    //         item.routeId
    //       ) {

    //         routesToCheck.push(
    //           item.routeId
    //         );

    //       }

    //     }
    //   );

    //   routesToCheck.forEach(
    //     (route) => {

    //       if (
    //         !route?.scheduledTime
    //       ) return;

    //       const [hour, minute] =
    //         route.scheduledTime
    //           .split(":")
    //           .map(Number);

    //       const tripTime =
    //         new Date();

    //       tripTime.setHours(
    //         hour,
    //         minute,
    //         0,
    //         0
    //       );

    //       const diffMinutes =
    //         (
    //           tripTime - now
    //         ) /
    //         1000 /
    //         60;

    //       // Same ACTIVE logic as Assigned Routes page
    //       if (
    //         diffMinutes <= 30 
            
    //       ) {

    //         activeRoutesCount++;

    //       }

    //     }
    //   );

    // }

    res.status(200).json({
      success: true,
      bus,
      activeTrip,
     
    });

  } catch (error) {

    console.log(
      "GET DRIVER DASHBOARD ERROR:",
      error
    );

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

    console.log(
  "START TRIP BODY:",
  req.body
);

    const {
      tripType,
      routeId,
    } = req.body;

    const route =
      await Route.findById(
        routeId
      );

    if (!route) {

      return res.status(404).json({
        success: false,
        message:
          "Route not found",
      });

    }

    const today =
  new Date()
    .toISOString()
    .split("T")[0];

const completedTrip =
  await Trip.findOne({

    routeId,

    tripType,

    tripDate: today,

    status: "COMPLETED",

  });

if (completedTrip) {

  const route =
    await Route.findById(
      routeId
    );

  if (
    route.updatedAt <=
    completedTrip.updatedAt
  ) {

    return res.status(400).json({
      success: false,
      message:
        "This trip has already been completed today",
    });

  }

}

  const now =
  new Date();

const [hours, minutes] =
  route.scheduledTime
    .split(":")
    .map(Number);

const scheduledTime =
  new Date();

scheduledTime.setHours(
  hours,
  minutes,
  0,
  0
);

const diffMinutes =
  (
    scheduledTime -
    now
  ) /
  1000 /
  60;

  console.log(
  "START TRIP CHECK:",
  {
    route: route.routeName,
    scheduledTime:
      route.scheduledTime,
    now,
    diffMinutes,
  }
);

if (
  diffMinutes > 30
) {

  return res.status(400).json({

    success: false,

    message:
      "Trip can only start 30 minutes before scheduled time",

  });

}

    


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

        tripDate:
          today,

        startTime:
          new Date(),

        status:
          "STARTED",
      });

     const students =
  await Student.find({
    busId: bus._id,
     routeId: routeId,
  });

const notifiedParents =
  new Set();

for (const student of students) {

  if (!student.parentId)
    continue;

  const parentId =
    student.parentId.toString();

  if (
    notifiedParents.has(
      parentId
    )
  ) {
    continue;
  }

  const parent =
    await User.findById(
      parentId
    );

  if (
    parent?.expoPushToken &&
    parent?.notificationSettings?.tripAlerts
  ) {

    await sendNotification(
      parent.expoPushToken,
      "🚌 Trip Started",
      "Bus has started its route."
    );

    notifiedParents.add(
      parentId
    );
  }
}

    res.status(201).json({
      success: true,
      trip,
    });

  } catch (error) {
    console.log(
    "START TRIP ERROR:",
    error
  );

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

      for (const student of students) {

  if (
    !boardedIds.includes(
      student._id.toString()
    )
  ) {

    continue;

  }

  const parent =
    await User.findById(
      student.parentId
    );

  if (

    parent
      ?.notificationSettings
      ?.boardingAlerts &&

    parent
      ?.expoPushToken

  ) {

    await sendNotification(

      parent.expoPushToken,

      trip.tripType === "DROP"
  ? "🔵 Student Reached Home"
  : "🏫 Student Reached School",

     trip.tripType === "DROP"

  ? `${student.name} has reached home safely`

  : `${student.name} has reached school safely`

    );

  }

}

    }

    trip.endTime =
      new Date();

    trip.status =
      "COMPLETED";

    await trip.save();

    await Student.updateMany(
  {
    busId:
      trip.busId,
  },
  {
    boardedToday:
      false,
  }
);

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

    if (!activeTrip) {

      return res.status(404).json({
        success: false,
        message:
          "No active trip found",
      });

    }

    console.log(
      "Trip Found:",
      activeTrip
    );

    console.log(
      "Trip Bus ID:",
      activeTrip.busId
    );

    const route =
      await Route.findById(
        activeTrip.routeId
      );

    if (!route) {

      return res.status(404).json({
        success: false,
        message:
          "Route not found",
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

    const groupedStudents =
      [];

    route.stops.forEach(
      (stop) => {

        const stopStudents =
          students.filter(
            (student) =>
              student.pickupStop ===
              stop.stopName
          );

        if (
          stopStudents.length > 0
        ) {

          groupedStudents.push({

            stopName:
              stop.stopName,

            students:
              stopStudents,

          });

        }

      }
    );

    res.status(200).json({

      success: true,

      groupedStudents,

    });

  } catch (error) {

    console.log(
      error
    );

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

       await Student.findByIdAndUpdate(
  studentId,
  {
    boardedToday: true,
  }
);

    const student =
  await Student.findById(
    studentId
  );

  if (!student) {

  return res.status(404).json({
    success: false,
    message: "Student not found",
  });

}

const parent =
  await User.findById(
    student.parentId
  );

  console.log(
  "PARENT:",
  parent
);

console.log(
  "BOARDING ALERTS:",
  parent?.notificationSettings?.boardingAlerts
);

console.log(
  "EXPO TOKEN:",
  parent?.expoPushToken
);

if (
  parent?.notificationSettings
    ?.boardingAlerts &&
  parent?.expoPushToken
)
 {

  console.log(
    "ENTERED PUSH BLOCK"
  );

  await sendNotification(

    parent.expoPushToken,

    "🟢 Student Boarded",

    `${student.name} has boarded the bus`

  );

}

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

    const activeTrip =
  await Trip.findOne({

    driverId:
      req.user.id,

    status:
      "STARTED",

  });

if (activeTrip) {

  return res.status(400).json({

    success: false,

    message:
      "Cannot Duty Off while a trip is active",

  });

}

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

    tripType:
        bus.routeId.tripType,

    scheduledTime:
        bus.routeId.scheduledTime,

    routePath:
    bus.routeId.stops
      ?.map(stop => stop.stopName)
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

    tripType:
        item.routeId.tripType,

    scheduledTime:
        item.routeId.scheduledTime,

     routePath:
    item.routeId.stops
      ?.map(stop => stop.stopName)
      .join(" → "),
});
        }
      );


    //   const activeTrips =
    //   await Trip.find({
    //     driverId:
    //       req.user.id,

    //     status:
    //       "STARTED",
    //   });

    // const activeRouteIds =
    //   activeTrips.map(
    //     (trip) =>
    //       trip.routeId.toString()
    //   );

    const startOfDay =
  new Date();

startOfDay.setHours(
  0,
  0,
  0,
  0
);

const todayTrips =
  await Trip.find({
    driverId:
      req.user.id,

    createdAt: {
      $gte:
        startOfDay,
    },
  });


   const now = new Date();
   

   console.log("=================================");
console.log("SERVER NOW:", now);
console.log("ISO:", now.toISOString());
console.log("UTC:", now.toUTCString());
console.log(
  "IST:",
  now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  })
);
console.log("=================================");

const routesWithStatus =
  routes.map((route) => {

   const routeTrips =
  todayTrips
    .filter(
      (t) =>
        t.routeId.toString() ===
        route._id.toString()
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt) -
        new Date(a.updatedAt)
    );

const trip =
  routeTrips[0];

    let status =
      "PENDING";

    // Completed trip always wins
   if (
  trip?.status ===
  "COMPLETED"
) {

  const routeDoc =
    bus.routeId &&
    bus.routeId._id.toString() ===
    route._id.toString()
      ? bus.routeId
      : extraRoutes.find(
          r =>
            r.routeId._id.toString() ===
            route._id.toString()
        )?.routeId;

 if (
  routeDoc?.reActivatedAt &&
  trip.updatedAt &&
  routeDoc.reActivatedAt >
  trip.updatedAt
) {

  const [hour, minute] =
    routeDoc.scheduledTime
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

  console.log(
  route.routeName,
  "TripTime:",
  tripTime,
  "Now:",
  now,
  "Diff:",
  (tripTime - now) / 1000 / 60
);

  const diffMinutes =
    (
      tripTime - now
    ) /
    1000 /
    60;

  console.log(
    "REACTIVATED:",
    route.routeName,
    "Diff:",
    diffMinutes
  );

  if (
     diffMinutes >= 0 &&
    diffMinutes <= 30 
  ) {

    status = "ACTIVE";

  } else {

    status = "PENDING";

  }

} else {

  status = "COMPLETED";

}

}

    // Started trip
    else if (
      trip?.status ===
      "STARTED"
    ) {

      status =
        "ACTIVE";

    }

    // No trip yet → check schedule
    else {

      const routeDoc =
        bus.routeId &&
        bus.routeId._id.toString() ===
        route._id.toString()
          ? bus.routeId
          : extraRoutes.find(
              (r) =>
                r.routeId._id.toString() ===
                route._id.toString()
            )?.routeId;

      if (
        routeDoc?.scheduledTime
      ) {

        const [
          hour,
          minute,
        ] =
          routeDoc.scheduledTime.split(
            ":"
          );

        const tripTime =
          new Date();

        tripTime.setHours(
          parseInt(hour)
        );

        tripTime.setMinutes(
          parseInt(minute)
        );

        tripTime.setSeconds(0);

       const diffMinutes =
  (
    tripTime -
    now
  ) /
  1000 /
  60;

console.log(
  route.routeName,
  "Diff:",
  diffMinutes
);

console.log(
  route.routeName,
  "Scheduled:",
  routeDoc.scheduledTime,
  "Diff:",
  diffMinutes,
  "Status:",
  diffMinutes <= 30 && diffMinutes >= 0
    ? "ACTIVE"
    : "PENDING"
);

if (
   diffMinutes >= 0 &&
  diffMinutes <= 30 
 
) {

  status =
    "ACTIVE";

} else {
  status = "PENDING";
}
      }
    }

   let minutesLeft = null;

if (route.scheduledTime) {

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

  minutesLeft =
    Math.ceil(
      (
        tripTime - now
      ) /
      1000 /
      60
    );
}

return {
  ...route,
  status,
  minutesLeft,
};
  });

  console.log(
  "ROUTES SENT:",
  routesWithStatus
);

      res.status(200).json({
        success: true,
        busNumber:
          bus.busNumber,
       routes:
          routesWithStatus,
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

      const route =
        await Route.findById(
          student.routeId
        );

      let pickupStop = null;

      if (route) {

        pickupStop =
          route.stops.find(
            (stop) =>
              stop.stopName ===
              student.pickupStop
          );

      }

    res.status(200).json({

      success: true,

      busId:
        student.busId,

      routeId:
        student.routeId,

      location,
      pickupStop,
      stops:
      route?.stops || [],


    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};


exports.getProfile =
async (req, res) => {

  console.log(
    "PROFILE API HIT"
  );

  try {

    const parent =
      await User.findById(
        req.user.id
      );

    const students =
      await Student.find({
        parentId:
          req.user.id,
      })
      .populate(
        "busId"
      )
      .populate(
        "routeId"
      );

    if (
      !students.length
    ) {

      return res.status(404).json({
        success: false,
        message:
          "No students found",
      });

    }

    const firstStudent =
      students[0];

    const bus =
      await Bus.findById(
        firstStudent.busId._id
      ).populate(
        "driverId",
        "name phone"
      );

    res.status(200).json({

      success: true,

      parent: {
        name:
          parent.name,

        phone:
          parent.phone,

        profileImage:
          parent.profileImage,
      },

      students,

      transport: {

        busNumber:
          bus.busNumber,

        vehicleNumber:
          bus.vehicleNumber,

        routeName:
          firstStudent.routeId
            ?.routeName,

        pickupStop:
          firstStudent
            .pickupStop,

        driverName:
          bus.driverId?.name,

        driverPhone:
          bus.driverId?.phone,

      },

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};


exports.updateProfileImage =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    user.profileImage =
      req.body.profileImage;

    await user.save();

    res.status(200).json({

      success: true,

      profileImage:
        user.profileImage,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};


exports.getHistory =
async (req, res) => {

  try {

    const {
      date,
    } = req.query;

    const students =
      await Student.find({
        parentId:
          req.user.id,
      });

    const studentIds =
      students.map(
        (student) =>
          student._id
      );

    let query = {

      studentId: {
        $in:
          studentIds,
      },

    };

    if (date) {

      const [year, month, day] =
  date.split("-");

const start =
  new Date(
    year,
    month - 1,
    day
  );

const end =
  new Date(
    year,
    month - 1,
    Number(day) + 1
  );


  console.log(
  "FILTER DATE:",
  date
);

console.log(
  "START:",
  start
);

console.log(
  "END:",
  end
);

      query.attendanceDate = {

        $gte: start,

        $lt: end,

      };

    } else {

}

    const attendance =
      await StudentAttendance.find(
        query
      )

      .populate(
        "studentId",
        "name pickupStop"
      )

      .sort({
        attendanceDate: -1,
      });

    const grouped = {};

    attendance.forEach(
      (record) => {

        const attendanceDate =
  new Date(
    record.attendanceDate
  );

const dateKey =
`${attendanceDate.getFullYear()}-${
  String(
    attendanceDate.getMonth() + 1
  ).padStart(2, "0")
}-${
  String(
    attendanceDate.getDate()
  ).padStart(2, "0")
}`;

        const groupKey =
          `${dateKey}-${record.tripType}`;

        if (
          !grouped[groupKey]
        ) {

          grouped[groupKey] = {

            date:
              dateKey,

            tripType:
              record.tripType,

            students: [],

          };

        }

        grouped[groupKey]
          .students
          .push({

            name:
              record.studentId.name,

            pickupStop:
              record.studentId.pickupStop,

            status:
              record.status,

          });

      }
    );

    const history =

  Object.values(
    grouped
  )

  .sort(
    (a, b) => {

      return (

        new Date(
          b.date
        ) -

        new Date(
          a.date
        )

      );

    }
  );

res.status(200).json({

  success: true,

  history:

    date

      ? history

      : history.slice(
          0,
          4
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

exports.updateNotificationSettings =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user.id
      );

    user.notificationSettings = {

      tripAlerts:
        req.body.tripAlerts,

      boardingAlerts:
        req.body.boardingAlerts,

    };

    await user.save();

    res.json({
      success: true,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};


exports.getNotificationSettings =
async (req, res) => {

  const user =
    await User.findById(
      req.user.id
    );

  res.json({

    success: true,

    settings:
      user.notificationSettings,

  });

};

exports.savePushToken =
async (req, res) => {

  try {

    await User.findByIdAndUpdate(
      req.user.id,
      {
        expoPushToken:
          req.body.token,
      }
    );

    res.json({
      success: true,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


exports.testNotification =
async (req, res) => {

  try {
    console.log("STEP 1");

    const parent =
      await User.findById(
        req.user.id
      );
      console.log("STEP 2");

      console.log(parent);

console.log("STEP 3");

    console.log(
      "TOKEN:",
      parent.expoPushToken
    );

    await sendNotification(

      parent.expoPushToken,

      "🧪 Test Notification",

      "Push notifications are working!"

    );

    console.log("STEP 4");

    res.json({

      success: true,

      message:
        "Notification sent",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};

exports.sendForgotPasswordOTP =
async (req, res) => {

  try {

    const { phone } =
      req.body;

    const user =
      await User.findOne({
        phone,
        role: {
          $in: [
            "PARENT",
            "DRIVER",
          ],
        },
      });

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "Phone number not found",
      });

    }

   const otp =
  process.env.OTP_MODE === "DEV"
    ? "123456"
    : Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();

    await Otp.deleteMany({
      phone,
    });

    await Otp.create({
      phone,
      otp,
      expiresAt:
        new Date(
          Date.now() +
          5 *
          60 *
          1000
        ),
      verified: false,
    });

  if (
  process.env.OTP_MODE === "DEV"
) {

  console.log(
    "Forgot Password OTP:",
    otp
  );

  return res.json({
    success: true,
    message:
      "OTP sent successfully",
    otp,
  });

}

const smsSent =
  await sendOTP(
    phone,
    otp
  );

if (!smsSent) {

  return res.status(500).json({
    success: false,
    message:
      "Failed to send OTP",
  });

}

res.json({
  success: true,
  message:
    "OTP sent successfully",
});

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};

exports.verifyForgotPasswordOTP =
async (req, res) => {

  try {

    const {
      phone,
      otp,
    } = req.body;

    const otpDoc =
      await Otp.findOne({
        phone,
        otp,
      });

    if (!otpDoc) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid OTP",
      });

    }

    if (
      otpDoc.expiresAt <
      new Date()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "OTP expired",
      });

    }

    otpDoc.verified =
      true;

    await otpDoc.save();

    res.json({
      success: true,
      message:
        "OTP verified",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};

exports.resetPassword =
async (req, res) => {

  try {

    const {
      phone,
      newPassword,
    } = req.body;

    const user =
      await User.findOne({
        phone,
      });

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });

    }

    const otpDoc =
      await Otp.findOne({
        phone,
        verified: true,
      });

    if (!otpDoc) {

      return res.status(400).json({
        success: false,
        message:
          "OTP verification required",
      });

    }

  const hashedPassword =
  await bcrypt.hash(
    newPassword,
    10
  );

await User.updateOne(
  {
    _id: user._id,
  },
  {
    $set: {
      password:
        hashedPassword,
    },
  }
);

    await Otp.deleteMany({
      phone,
    });

    res.json({
      success: true,
      message:
        "Password updated successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};