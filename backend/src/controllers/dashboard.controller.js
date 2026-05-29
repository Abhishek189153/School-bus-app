const Student =
require("../models/student.model");

const Bus =
require("../models/bus.model");

const Route =
require("../models/route.model");

const User =
require("../models/user.model");

exports.getDashboardStats =
async (req, res) => {

    try {

        const schoolId =
            req.user.schoolId;

        const students =
            await Student.countDocuments({
                schoolId
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

        res.json({
            success: true,
            stats: {
                students,
                buses,
                routes,
                drivers
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};