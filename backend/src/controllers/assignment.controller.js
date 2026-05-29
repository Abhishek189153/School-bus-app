const Bus = require("../models/bus.model");
const Student = require("../models/student.model");

exports.assignDriverToBus =
async (req, res) => {

    try {

        const {
            busId,
            driverId
        } = req.body;

        const bus =
            await Bus.findByIdAndUpdate(
                busId,
                { driverId },
                { new: true }
            );

        res.json({
            success: true,
            bus
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.assignStudentToBus =
async (req, res) => {

    try {

        const {
            studentId,
            busId
        } = req.body;

        const student =
            await Student.findByIdAndUpdate(
                studentId,
                { busId },
                { new: true }
            );

        res.json({
            success: true,
            student
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};