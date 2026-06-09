const Student =
require("../models/student.model");

console.log(
  "🚀 DASHBOARD CONTROLLER FILE LOADED"
);

const Bus =
require("../models/bus.model");

const Route =
require("../models/route.model");

const User =require("../models/user.model");


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

        const activeBuses =
        await Bus.countDocuments({
            schoolId: req.user.schoolId,
            driverId: {
            $exists: true,
            $ne: null,
            },

            routeId: {
            $exists: true,
            $ne: null,
    },
        });

        const inactiveBuses =
        buses - activeBuses;


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