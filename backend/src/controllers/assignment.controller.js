const Bus = require("../models/bus.model");
const Student = require("../models/student.model");
const User = require("../models/user.model");
const Route = require("../models/route.model");


exports.assignDriverToBus =
async (req, res) => {

    try {

        const {
            busId,
            driverId,
        } = req.body;

        const bus =
            await Bus.findById(busId);

        const driver =
            await User.findById(driverId);

        if (!bus || !driver) {

            return res.status(404).json({
                success: false,
                message:
                    "Bus or Driver not found",
            });

        }

        if (
            bus.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Access denied",
            });

        }

        if (
            driver.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Driver belongs to another school",
            });

        }

        bus.driverId = driverId;

        await bus.save();

        res.status(200).json({
            success: true,
            bus,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.assignStudentToBus =
async (req, res) => {

    try {

        const {
            studentId,
            busId,
        } = req.body;

        const student =
            await Student.findById(
                studentId
            );

        const bus =
            await Bus.findById(
                busId
            );

        if (!student || !bus) {

            return res.status(404).json({
                success: false,
                message:
                    "Student or Bus not found",
            });

        }

        if (
            student.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Student belongs to another school",
            });

        }

        if (
            bus.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Bus belongs to another school",
            });

        }

        student.busId = busId;

        await student.save();

        res.status(200).json({
            success: true,
            student,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.assignRouteToBus =
async (req, res) => {

    try {

        const {
            busId,
            routeId,
        } = req.body;

        const bus =
            await Bus.findById(
                busId
            );

        const route =
            await Route.findById(
                routeId
            );

        if (!bus || !route) {

            return res.status(404).json({
                success: false,
                message:
                    "Bus or Route not found",
            });

        }

        if (
            bus.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Bus belongs to another school",
            });

        }

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

        bus.routeId = routeId;

        await bus.save();

        res.status(200).json({
            success: true,
            bus,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};