const Student = require("../models/student.model");

const Bus = require("../models/bus.model");

const Route = require("../models/route.model");

const User = require("../models/user.model");

const BusRoute = require("../models/busRoute.model");


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
            schoolId: req.user.schoolId,
            busId: {
            $exists: true,
            $ne: null,
            },
        });

        const studentsUnassigned =
        await Student.countDocuments({
            schoolId: req.user.schoolId,
            $or: [
            { busId: null },
            { busId: { $exists: false } },
            ],
        });

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
    schoolId: req.user.schoolId,
  });

let activeBuses = 0;

for (const bus of busesData) {

  const studentCount =
    await Student.countDocuments({
      busId: bus._id,
    });

  const additionalRoutes =
    await BusRoute.countDocuments({
      busId: bus._id,
    });

  const hasRoute =
    bus.routeId ||
    additionalRoutes > 0;

  const isActive =
    bus.driverId &&
    hasRoute &&
    studentCount > 0;

  if (isActive) {
    activeBuses++;
  }

}

const inactiveBuses =
  busesData.length -
  activeBuses;

       


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
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};