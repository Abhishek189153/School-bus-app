const Student = require("../models/student.model");

const Bus = require("../models/bus.model");

const Route = require("../models/route.model");

const User = require("../models/user.model");

const BusRoute = require("../models/busRoute.model");

const StudentAttendance = require("../models/studentAttendance.model");


exports.getDashboardStats =
async (req, res) => {

    try {

        const schoolId =
            req.user.schoolId;

        const students =
            await Student.countDocuments({
                schoolId
            });

        const parents =
            await User.countDocuments({
                schoolId,
                role: "PARENT"
            });

        const buses =
            await Bus.countDocuments({
                schoolId
            });

        const routes =
            await Route.countDocuments({
                schoolId
            });

        const drivers =
            await User.countDocuments({
                schoolId,
                role: "DRIVER"
            });


       const studentsAssigned =
    await Student.countDocuments({
        schoolId,
        $or: [
            {
                pickupBusId: {
                    $exists: true,
                    $ne: null,
                },
            },
            {
                dropBusId: {
                    $exists: true,
                    $ne: null,
                },
            },
        ],
    });

       const studentsUnassigned =
    students - studentsAssigned;

        const driversAssigned =
        await Bus.countDocuments({
            schoolId: req.user.schoolId,
            driverId: {
            $exists: true,
            $ne: null,
            },
        });

        const driversUnassigned =
        drivers - driversAssigned;

      const busesData =
    await Bus.find({
        schoolId,
    });

let activeBuses = 0;

for (const bus of busesData) {

    // Check whether bus has a route
    const additionalRoutes =
        await BusRoute.countDocuments({
            busId: bus._id,
        });

    const hasRoute =
        Boolean(bus.routeId) ||
        additionalRoutes > 0;

    // Check whether students are assigned
    // to this bus for pickup OR drop
    const studentCount =
        await Student.countDocuments({
            schoolId,
            $or: [
                {
                    pickupBusId: bus._id,
                },
                {
                    dropBusId: bus._id,
                },
            ],
        });

    const isActive =
        Boolean(bus.driverId) &&
        hasRoute &&
        studentCount > 0;

    if (isActive) {
        activeBuses++;
    }
}

const inactiveBuses =
    busesData.length - activeBuses;


  // Today's Attendance (All PICKUP Trips)

const now = new Date(
  new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  })
);

const today =
`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;

// Total Present Students
const presentStudents =
await StudentAttendance.countDocuments({

    schoolId,

    tripType:"PICKUP",

    status:"PRESENT",

    tripDate: today,

});

// Total Students Assigned to Buses
const totalAttendanceStudents = await Student.countDocuments({
  schoolId,
  pickupBusId: {
    $exists: true,
    $ne: null,
  },
});

const attendancePercentage =
  totalAttendanceStudents > 0
    ? Math.round(
        (presentStudents /
          totalAttendanceStudents) *
          100
      )
    : 0;
       


        res.json({
            success: true,
            stats: {
                students,
                parents,
                buses,
                routes,
                drivers,

                studentsAssigned,
                studentsUnassigned,

                driversAssigned,
                driversUnassigned,

                activeBuses,
                inactiveBuses,

                attendance: {
                present: presentStudents,
                total: totalAttendanceStudents,
                percentage: attendancePercentage,
    },
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};