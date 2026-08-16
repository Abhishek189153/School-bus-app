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
const Holiday = require("../models/holiday.model");
const bcrypt = require("bcryptjs");
const {sendOTP,} = require("../services/sms.service");
const {sendNotification} = require("../services/pushNotification.service");
const WorkingDay = require("../models/workingDay.model");




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


        // ==========================================
        // VALIDATE TRIP TYPE
        // ==========================================

        if (
            !tripType ||
            !["PICKUP", "DROP"].includes(tripType)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Valid trip type is required: PICKUP or DROP",
            });

        }


        // ==========================================
        // FIND ROUTE
        // ==========================================

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


        // ==========================================
        // CHECK ROUTE BELONGS TO SCHOOL
        // ==========================================

        if (
            route.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Route belongs to another school",
            });

        }


        // ==========================================
        // CHECK ROUTE TYPE
        // ==========================================

        if (
            route.tripType !==
            tripType
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `This route is a ${route.tripType} route`,
            });

        }


        // ==========================================
        // INDIA DATE
        // ==========================================

        const now = new Date(
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
        // CHECK IF THIS TRIP WAS ALREADY COMPLETED
        // TODAY
        // ==========================================

        const completedTrip =
            await Trip.findOne({

                routeId,

                tripType,

                tripDate:
                    today,

                status:
                    "COMPLETED",

            });


        if (completedTrip) {

            // Check whether route was edited
            // after the previous trip was completed

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


        // ==========================================
        // CHECK SCHEDULED TIME
        // ==========================================

        const [
            hours,
            minutes
        ] =
            route.scheduledTime
                .split(":")
                .map(Number);


        const scheduledTime =
            new Date(now);


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
                route:
                    route.routeName,

                tripType,

                scheduledTime:
                    route.scheduledTime,

                now,

                diffMinutes,
            }
        );


        // ==========================================
        // TRIP CAN START ONLY 30 MINUTES BEFORE
        // SCHEDULED TIME
        // ==========================================

        if (
            diffMinutes > 30
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Trip can only start 30 minutes before scheduled time",

            });

        }


        // ==========================================
        // FIND DRIVER'S BUS
        // ==========================================

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


        // ==========================================
        // CHECK EXISTING ACTIVE TRIP
        // ==========================================

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


        // ==========================================
        // CREATE TRIP
        // ==========================================

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


        // ==========================================
        // DRIVER ATTENDANCE
        // ==========================================

        const existingAttendance =
            await Attendance.findOne({

                driverId:
                    req.user.id,

                schoolId:
                    req.user.schoolId,

                tripDate:
                    today,

            });


        // First trip of the day
        if (!existingAttendance) {

            console.log(
                "Creating Attendance..."
            );


            const attendance =
                await Attendance.create({

                    driverId:
                        req.user.id,

                    schoolId:
                        req.user.schoolId,

                    tripDate:
                        today,

                    dutyOnTime:
                        new Date(),

                    status:
                        "PRESENT",

                });


            console.log(
                "Attendance Created:",
                attendance
            );

        } else {

            console.log(
                "Attendance already exists"
            );

        }


        // ==========================================
        // FIND STUDENTS FOR THIS TRIP
        // ==========================================

        let students;


        if (
            tripType ===
            "PICKUP"
        ) {

            // PICKUP:
            // pickupBusId + pickupRouteId

            students =
                await Student.find({

                    schoolId:
                        req.user.schoolId,

                    pickupBusId:
                        bus._id,

                    pickupRouteId:
                        routeId,

                });

        } else {

            // DROP:
            // dropBusId + dropRouteId

            students =
                await Student.find({

                    schoolId:
                        req.user.schoolId,

                    dropBusId:
                        bus._id,

                    dropRouteId:
                        routeId,

                });

        }


        console.log(
            "TRIP STUDENTS:",
            {
                tripType,
                routeId,
                busId: bus._id,
                totalStudents:
                    students.length,
            }
        );


        // ==========================================
        // NOTIFY PARENTS
        // ==========================================

        const notifiedParents =
            new Set();


        for (
            const student of students
        ) {

            if (
                !student.parentId
            ) {
                continue;
            }


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
                parent
                    ?.notificationSettings
                    ?.tripAlerts
            ) {

                await sendNotification(

                    parent.expoPushToken,

                    "🚌 Trip Started",

                    tripType === "PICKUP"

                        ? "Your child's pickup bus has started its route."

                        : "Your child's drop bus has started its route."

                );


                notifiedParents.add(
                    parentId
                );

            }

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({

            success: true,

            trip,

            totalStudents:
                students.length,

        });


    } catch (error) {

        console.log(
            "START TRIP ERROR:",
            error
        );


        return res.status(500).json({

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

        // ==========================================
        // FIND TRIP
        // ==========================================

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


        // ==========================================
        // FIND STUDENTS FOR THIS TRIP
        // ==========================================

        let students;


        if (
            trip.tripType ===
            "PICKUP"
        ) {

            // PICKUP:
            // pickupBusId + pickupRouteId

            students =
                await Student.find({

                    schoolId:
                        trip.schoolId,

                    pickupBusId:
                        trip.busId,

                    pickupRouteId:
                        trip.routeId,

                });

        } else {

            // DROP:
            // dropBusId + dropRouteId

            students =
                await Student.find({

                    schoolId:
                        trip.schoolId,

                    dropBusId:
                        trip.busId,

                    dropRouteId:
                        trip.routeId,

                });

        }


        console.log(
            "END TRIP STUDENTS:",
            {
                tripType:
                    trip.tripType,

                busId:
                    trip.busId,

                routeId:
                    trip.routeId,

                totalStudents:
                    students.length,
            }
        );


        // ==========================================
        // FIND BOARDED STUDENTS
        // ==========================================

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


        // ==========================================
        // CHECK ATTENDANCE ALREADY CREATED
        // ==========================================

        const existingAttendance =
            await StudentAttendance.findOne({

                tripId:
                    trip._id,

            });


        // ==========================================
        // CREATE STUDENT ATTENDANCE
        // ==========================================

        if (
            !existingAttendance
        ) {

            const attendanceRecords =
                students.map(
                    (student) => ({

                        studentId:
                            student._id,

                        tripId:
                            trip._id,

                        tripType:
                            trip.tripType,

                        tripDate:
                            trip.tripDate,

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


            // Only insert if there are students

            if (
                attendanceRecords.length > 0
            ) {

                await StudentAttendance.insertMany(
                    attendanceRecords
                );

            }


            // ==========================================
            // SEND STUDENT REACHED NOTIFICATIONS
            // ==========================================

            for (
                const student of students
            ) {

                // Student did not board
                // so don't send reached notification

                if (
                    !boardedIds.includes(
                        student._id.toString()
                    )
                ) {

                    continue;

                }


                // Student has no parent

                if (
                    !student.parentId
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

                        trip.tripType ===
                        "DROP"

                            ? "🔵 Student Reached Home"

                            : "🏫 Student Reached School",


                        trip.tripType ===
                        "DROP"

                            ? `${student.name} has reached home safely`

                            : `${student.name} has reached school safely`

                    );

                }

            }

        }


        // ==========================================
        // COMPLETE TRIP
        // ==========================================

        trip.endTime =
            new Date();


        trip.status =
            "COMPLETED";


        await trip.save();


        // ==========================================
        // DRIVER DUTY OFF
        // ==========================================

        await updateDriverDutyOff(

            req.user.id,

            req.user.schoolId,

            trip.tripDate

        );


        // ==========================================
        // RESET BOARDED STATUS
        // ONLY FOR STUDENTS OF THIS TRIP
        // ==========================================

        const studentIds =
            students.map(
                (student) =>
                    student._id
            );


        if (
            studentIds.length > 0
        ) {

            await Student.updateMany(

                {
                    _id: {
                        $in:
                            studentIds,
                    },
                },

                {
                    $set: {
                        boardedToday:
                            false,
                    },
                }

            );

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Trip Completed",

            totalStudents:
                students.length,

            present:
                boardedIds.length,

            absent:
                Math.max(
                    students.length -
                    boardedIds.length,
                    0
                ),

        });


    } catch (error) {

        console.log(
            "END TRIP ERROR:",
            error
        );


        return res.status(500).json({

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


        // ==========================================
        // FIND ACTIVE TRIP
        // ==========================================

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
            "Trip Type:",
            activeTrip.tripType
        );


        console.log(
            "Trip Bus ID:",
            activeTrip.busId
        );


        console.log(
            "Trip Route ID:",
            activeTrip.routeId
        );


        // ==========================================
        // FIND ROUTE
        // ==========================================

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


        // ==========================================
        // FIND STUDENTS
        // ==========================================

        let students;


        if (
            activeTrip.tripType ===
            "PICKUP"
        ) {

            // --------------------------------------
            // PICKUP STUDENTS
            // --------------------------------------

            students =
                await Student.find({

                    schoolId:
                        activeTrip.schoolId,

                    pickupBusId:
                        activeTrip.busId,

                    pickupRouteId:
                        activeTrip.routeId,

                });


        } else if (
            activeTrip.tripType ===
            "DROP"
        ) {

            // --------------------------------------
            // DROP STUDENTS
            // --------------------------------------

            students =
                await Student.find({

                    schoolId:
                        activeTrip.schoolId,

                    dropBusId:
                        activeTrip.busId,

                    dropRouteId:
                        activeTrip.routeId,

                });


        } else {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid trip type",

            });

        }


        console.log(
            "Students Found:",
            students.length
        );


        // ==========================================
        // GROUP STUDENTS BY STOP
        // ==========================================

        const groupedStudents =
            [];


        route.stops.forEach(
            (stop) => {


                const stopStudents =
                    students.filter(
                        (student) => {

                            const studentStop =
                                activeTrip.tripType ===
                                "PICKUP"

                                    ? student.pickupStop

                                    : student.dropStop;


                            return (
                                studentStop ===
                                stop.stopName
                            );

                        }
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


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            tripType:
                activeTrip.tripType,

            groupedStudents,

        });


    } catch (error) {

        console.log(
            "GET TRIP STUDENTS ERROR:",
            error
        );


        return res.status(500).json({

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


        // ==========================================
        // FIND TRIP
        // ==========================================

        const trip =
            await Trip.findById(
                tripId
            )
            .populate("driverId")
            .populate("busId");


        if (!trip) {

            return res.status(404).json({

                success: false,

                message:
                    "Trip not found",

            });

        }


        // ==========================================
        // FIND BUS
        // ==========================================

        const bus =
            await Bus.findById(
                trip.busId._id
            );


        if (!bus) {

            return res.status(404).json({

                success: false,

                message:
                    "Bus not found",

            });

        }


        // ==========================================
        // FIND ROUTE
        // ==========================================

        const route =
            await Route.findById(
                trip.routeId
            );


        if (!route) {

            return res.status(404).json({

                success: false,

                message:
                    "Route not found",

            });

        }


        // ==========================================
        // FIND STUDENTS FOR THIS TRIP
        // ==========================================

        let students;


        if (
            trip.tripType ===
            "PICKUP"
        ) {

            // --------------------------------------
            // PICKUP STUDENTS
            // --------------------------------------

            students =
                await Student.find({

                    schoolId:
                        trip.schoolId,

                    pickupBusId:
                        trip.busId._id,

                    pickupRouteId:
                        trip.routeId,

                });


        } else if (
            trip.tripType ===
            "DROP"
        ) {

            // --------------------------------------
            // DROP STUDENTS
            // --------------------------------------

            students =
                await Student.find({

                    schoolId:
                        trip.schoolId,

                    dropBusId:
                        trip.busId._id,

                    dropRouteId:
                        trip.routeId,

                });


        } else {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid trip type",

            });

        }


        // ==========================================
        // FIND BOARDED STUDENTS
        // ==========================================

        const boardedRecords =
            await Boarding.find({

                tripId,

            }).populate(
                "studentId"
            );


        const boardedStudents =
            boardedRecords
                .filter(
                    (record) =>
                        record.studentId
                )
                .map(
                    (record) => ({

                        _id:
                            record.studentId._id,

                        name:
                            record.studentId.name,

                    })
                );


        // ==========================================
        // BOARDed STUDENT IDS
        // ==========================================

        const boardedIds =
            boardedStudents.map(
                (student) =>
                    student._id.toString()
            );


        // ==========================================
        // ABSENT STUDENTS
        // ==========================================

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


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            tripType:
                trip.tripType,

            driverName:
                trip.driverId?.name,

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

        console.log(
            "TRIP SUMMARY ERROR:",
            error
        );


        return res.status(500).json({

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

        // ==========================================
        // GET DRIVER TRIPS
        // ==========================================

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


        // ==========================================
        // BUILD HISTORY
        // ==========================================

        const history =
            await Promise.all(

                trips.map(
                    async (trip) => {


                        // ==================================
                        // BOARDED STUDENTS
                        // ==================================

                        const boarded =
                            await Boarding.countDocuments({

                                tripId:
                                    trip._id,

                            });


                        // ==================================
                        // TOTAL STUDENTS FOR THIS TRIP
                        // ==================================

                        let totalStudents;


                        if (
                            trip.tripType ===
                            "PICKUP"
                        ) {

                            totalStudents =
                                await Student.countDocuments({

                                    schoolId:
                                        trip.schoolId,

                                    pickupBusId:
                                        trip.busId._id,

                                    pickupRouteId:
                                        trip.routeId._id,

                                });

                        } else if (
                            trip.tripType ===
                            "DROP"
                        ) {

                            totalStudents =
                                await Student.countDocuments({

                                    schoolId:
                                        trip.schoolId,

                                    dropBusId:
                                        trip.busId._id,

                                    dropRouteId:
                                        trip.routeId._id,

                                });

                        } else {

                            totalStudents =
                                0;

                        }


                        // ==================================
                        // RETURN HISTORY ITEM
                        // ==================================

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

                            totalStudents,

                            status:
                                trip.status,

                        };

                    }
                )

            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            history,

        });


    } catch (error) {

        console.log(
            "TRIP HISTORY ERROR:",
            error
        );


        return res.status(500).json({

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


     // Current time in IST
const now = new Date(
  new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  })
);

  const startOfDay = new Date(now);

startOfDay.setHours(
  0,
  0,
  0,
  0
);

const endOfDay =
new Date(now);

endOfDay.setHours(
  23,
  59,
  59,
  999
);


const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;


// =============================
// Working Day Check
// =============================

const weekdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const todayKey = weekdays[now.getDay()];

const workingDay = await WorkingDay.findOne({
  schoolId: req.user.schoolId,
});

if (workingDay && !workingDay[todayKey]) {

  return res.status(200).json({

    success: true,

    weeklyOff: true,

    day:
      todayKey.charAt(0).toUpperCase() +
      todayKey.slice(1),

    message: "Today is a weekly off.",

    routes: [],

  });

}

// Sunday Check
// if (now.getDay() === 0) {

//   return res.status(200).json({
//     success: true,
//     holiday: true,
//     holidayName: "Sunday",
//     message: "Today is a holiday.",
//     routes: [],
//   });

// }

// School Holiday Check
const holiday = await Holiday.findOne({
  schoolId: req.user.schoolId,
  date: today,
});

if (holiday) {

  return res.status(200).json({
    success: true,
    holiday: true,
    holidayName: holiday.title,
    message: "Today is a holiday.",
    routes: [],
  });

}

const todayTrips =
await Trip.find({
  driverId: req.user.id,
  tripDate: today
});


 
   

//    console.log("=================================");
// console.log("SERVER NOW:", now);
// console.log("ISO:", now.toISOString());
// console.log("UTC:", now.toUTCString());
// console.log(
//   "IST:",
//   now.toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//   })
// );
// console.log("=================================");

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

 const tripTime = new Date(now);

tripTime.setHours(
  hour,
  minute,
  0,
  0
);

//   console.log(
//   route.routeName,
//   "TripTime:",
//   tripTime,
//   "Now:",
//   now,
//   "Diff:",
//   (tripTime - now) / 1000 / 60
// );

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
          new Date(now);

       tripTime.setHours(
    parseInt(hour),
    parseInt(minute),
    0,
    0
);

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

if (diffMinutes > 30) {
  status = "PENDING";
} else {
  status = "ACTIVE";
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
    new Date(now);

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

 
exports.getMyBusLocation = async (
    req,
    res
) => {

    console.log(
        "GET MY BUS LOCATION HIT"
    );

    try {

        // ==========================================
        // FIND STUDENT
        // ==========================================

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


        // ==========================================
        // STUDENT TRANSPORT ASSIGNMENTS
        // ==========================================

        const transportOptions = [];


        // ------------------------------------------
        // PICKUP
        // ------------------------------------------

        if (
            student.pickupBusId &&
            student.pickupRouteId
        ) {

            transportOptions.push({

                tripType:
                    "PICKUP",

                busId:
                    student.pickupBusId,

                routeId:
                    student.pickupRouteId,

                stopName:
                    student.pickupStop,

            });

        }


        // ------------------------------------------
        // DROP
        // ------------------------------------------

        if (
            student.dropBusId &&
            student.dropRouteId
        ) {

            transportOptions.push({

                tripType:
                    "DROP",

                busId:
                    student.dropBusId,

                routeId:
                    student.dropRouteId,

                stopName:
                    student.dropStop,

            });

        }


        if (
            !transportOptions.length
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "No transport assigned to this student",

            });

        }


        // ==========================================
        // FIND ACTIVE TRIP
        //
        // IMPORTANT:
        // Match BOTH bus AND route AND trip type
        // ==========================================

        let activeTrip = null;


        for (
            const option
            of transportOptions
        ) {

            const trip =
                await Trip.findOne({

                    status:
                        "STARTED",

                    tripType:
                        option.tripType,

                    busId:
                        option.busId,

                    routeId:
                        option.routeId,

                })
                .sort({
                    createdAt:
                        -1,
                });


            if (trip) {

                activeTrip =
                    trip;

                break;

            }

        }


        // ==========================================
        // DETERMINE TRANSPORT TO DISPLAY
        // ==========================================

        let selectedTransport;


        if (activeTrip) {

            // --------------------------------------
            // ACTIVE TRIP
            // --------------------------------------

            selectedTransport =
                transportOptions.find(
                    (option) =>
                        option.tripType ===
                        activeTrip.tripType &&

                        option.busId.toString() ===
                        activeTrip.busId.toString() &&

                        option.routeId.toString() ===
                        activeTrip.routeId.toString()
                );

        }


        // ==========================================
        // NO ACTIVE TRIP
        //
        // Find the most recently used trip so that
        // we can still show:
        //
        // - last bus location
        // - last route
        // - route stops
        // - student's stop
        // ==========================================

        if (!activeTrip) {

            const recentTrips =
                await Trip.find({

                    $or:
                        transportOptions.map(
                            (option) => ({

                                tripType:
                                    option.tripType,

                                busId:
                                    option.busId,

                                routeId:
                                    option.routeId,

                            })
                        ),

                })
                .sort({

                    createdAt:
                        -1,

                })
                .limit(1);


            if (
                recentTrips.length
            ) {

                const recentTrip =
                    recentTrips[0];


                selectedTransport =
                    transportOptions.find(
                        (option) =>
                            option.tripType ===
                            recentTrip.tripType &&

                            option.busId.toString() ===
                            recentTrip.busId.toString() &&

                            option.routeId.toString() ===
                            recentTrip.routeId.toString()
                    );

            }

        }


        // ==========================================
        // FINAL FALLBACK
        //
        // If there is no active/recent trip,
        // use pickup first, otherwise drop.
        // ==========================================

        if (!selectedTransport) {

            selectedTransport =
                transportOptions[0];

        }


        // ==========================================
        // SELECT BUS / ROUTE
        // ==========================================

        const busId =
            selectedTransport.busId;

        const routeId =
            selectedTransport.routeId;

        const tripType =
            selectedTransport.tripType;

        const stopName =
            selectedTransport.stopName;


        // ==========================================
        // FIND LAST KNOWN BUS LOCATION
        //
        // IMPORTANT:
        // This works even when trip is completed.
        // ==========================================

        const location =
            await BusLocation.findOne({

                busId:
                    busId,

            });


        // ==========================================
        // FIND ROUTE
        // ==========================================

        const route =
            await Route.findById(
                routeId
            );


        // ==========================================
        // FIND STUDENT STOP
        // ==========================================

        let studentStop =
            null;


        if (route) {

            studentStop =
                route.stops.find(
                    (stop) =>
                        stop.stopName ===
                        stopName
                );

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            // TRUE = currently moving
            // FALSE = last known location only

            activeTrip:
                !!activeTrip,

            tripId:
                activeTrip?._id ||
                null,

            tripType:
                tripType,

            busId:
                busId,

            routeId:
                routeId,

            // Last known location
            location:
                location,

            studentStop:
                studentStop,

            // All stops of selected route
            stops:
                route?.stops ||
                [],

        });


    } catch (error) {

        console.log(
            "GET MY BUS LOCATION ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


exports.getProfile = async (
    req,
    res
) => {

    console.log(
        "PROFILE API HIT"
    );

    try {

        // ==========================================
        // FIND PARENT
        // ==========================================

        const parent =
            await User.findById(
                req.user.id
            );


        if (!parent) {

            return res.status(404).json({

                success: false,

                message:
                    "Parent not found",

            });

        }


        // ==========================================
        // FIND STUDENTS
        // ==========================================

        const students =
            await Student.find({

                parentId:
                    req.user.id,

            })

            // Pickup
            .populate(
                "pickupBusId"
            )

            .populate(
                "pickupRouteId"
            )

            // Drop
            .populate(
                "dropBusId"
            )

            .populate(
                "dropRouteId"
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


        // ==========================================
        // FIRST STUDENT
        // ==========================================

        const firstStudent =
            students[0];


        // ==========================================
        // PICKUP BUS + DRIVER
        // ==========================================

        let pickupBus =
            null;


        if (
            firstStudent.pickupBusId
        ) {

            pickupBus =
                await Bus.findById(
                    firstStudent.pickupBusId._id
                ).populate(
                    "driverId",
                    "name phone"
                );

        }


        // ==========================================
        // DROP BUS + DRIVER
        // ==========================================

        let dropBus =
            null;


        if (
            firstStudent.dropBusId
        ) {

            dropBus =
                await Bus.findById(
                    firstStudent.dropBusId._id
                ).populate(
                    "driverId",
                    "name phone"
                );

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,


            // ======================================
            // PARENT
            // ======================================

            parent: {

                name:
                    parent.name,

                phone:
                    parent.phone,

                profileImage:
                    parent.profileImage,

            },


            // ======================================
            // STUDENTS
            // ======================================

            students,


            // ======================================
            // TRANSPORT
            // ======================================

            transport: {

                // ----------------------------------
                // PICKUP
                // ----------------------------------

                pickup: {

                    busId:
                      pickupBus
                          ?._id,

                    busNumber:
                        pickupBus
                            ?.busNumber,

                    vehicleNumber:
                        pickupBus
                            ?.vehicleNumber,

                    routeName:
                        firstStudent
                            .pickupRouteId
                            ?.routeName,

                    pickupStop:
                        firstStudent
                            .pickupStop,

                    driverName:
                        pickupBus
                            ?.driverId
                            ?.name,

                    driverPhone:
                        pickupBus
                            ?.driverId
                            ?.phone,

                },


                // ----------------------------------
                // DROP
                // ----------------------------------

                drop: {


                    busId:
                      dropBus
                          ?._id,

                    busNumber:
                        dropBus
                            ?.busNumber,

                    vehicleNumber:
                        dropBus
                            ?.vehicleNumber,

                    routeName:
                        firstStudent
                            .dropRouteId
                            ?.routeName,

                    dropStop:
                        firstStudent
                            .dropStop,

                    driverName:
                        dropBus
                            ?.driverId
                            ?.name,

                    driverPhone:
                        dropBus
                            ?.driverId
                            ?.phone,

                },

            },

        });


    } catch (error) {

        console.log(
            "PROFILE API ERROR:",
            error
        );


        return res.status(500).json({

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


exports.getHistory = async (
    req,
    res
) => {

    try {

        const {
            date,
        } = req.query;


        // ==========================================
        // FIND PARENT'S STUDENTS
        // ==========================================

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


        // ==========================================
        // BUILD QUERY
        // ==========================================

        let query = {

            studentId: {
                $in:
                    studentIds,
            },

        };


        // ==========================================
        // DATE FILTER
        // ==========================================

        if (date) {

            const [
                year,
                month,
                day
            ] =
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

                $gte:
                    start,

                $lt:
                    end,

            };

        }


        // ==========================================
        // GET ATTENDANCE
        // ==========================================

        const attendance =
            await StudentAttendance.find(
                query
            )

            .populate(
                "studentId",
                "name pickupStop dropStop"
            )

            .sort({
                attendanceDate:
                    -1,
            });


        // ==========================================
        // GROUP ATTENDANCE
        // BY DATE + TRIP TYPE
        // ==========================================

        const grouped = {};


        attendance.forEach(
            (record) => {

                if (
                    !record.studentId
                ) {

                    return;

                }


                const attendanceDate =
                    new Date(
                        record.attendanceDate
                    );


                const dateKey =
                    `${attendanceDate.getFullYear()}-${String(
                        attendanceDate.getMonth() + 1
                    ).padStart(2, "0")}-${String(
                        attendanceDate.getDate()
                    ).padStart(2, "0")}`;


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

                        students:
                            [],

                    };

                }


                // ==================================
                // SELECT CORRECT STOP
                // ==================================

                const stop =
                    record.tripType ===
                    "PICKUP"

                        ? record
                            .studentId
                            .pickupStop

                        : record
                            .studentId
                            .dropStop;


                grouped[groupKey]
                    .students
                    .push({

                        name:
                            record
                                .studentId
                                .name,

                        stop,

                        status:
                            record.status,

                          time:
                          record.attendanceDate,

                    });

            }
        );


        // ==========================================
        // SORT HISTORY
        // ==========================================

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


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

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

        console.log(
            "GET HISTORY ERROR:",
            error
        );


        return res.status(500).json({

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

async function updateDriverDutyOff(
  driverId,
  schoolId,
  tripDate
) {

  // Find today's attendance
  const attendance =
    await Attendance.findOne({
      driverId,
      schoolId,
      tripDate,
    });

  if (!attendance) return;

  // Driver's bus
  const bus =
    await Bus.findOne({
      driverId,
      schoolId,
    });

  if (!bus) return;

  // Extra assigned routes
  const extraRoutes =
    await BusRoute.find({
      busId: bus._id,
    });

  // Total assigned routes
  const totalAssignedRoutes =
    (bus.routeId ? 1 : 0) +
    extraRoutes.length;

  // Completed trips today
  const completedTrips =
    await Trip.countDocuments({
      driverId,
      tripDate,
      status: "COMPLETED",
    });

  console.log("========== DUTY OFF CHECK ==========");
  console.log("Assigned Routes:", totalAssignedRoutes);
  console.log("Completed Trips:", completedTrips);

  // Driver finished all assigned routes
  if (
    completedTrips === totalAssignedRoutes &&
    !attendance.dutyOffTime
  ) {

    attendance.dutyOffTime =
      new Date();

    await attendance.save();

    console.log(
      "Duty OFF marked."
    );

  }

}