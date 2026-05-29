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

exports.assignRouteToBus =
async (req, res) => {
    console.log(req.body);

  try {

    const {
      busId,
      routeId,
    } = req.body;

    const bus =
      await Bus.findByIdAndUpdate(
        busId,
        {
          routeId,
        },
        {
          new: true,
        }
      );

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