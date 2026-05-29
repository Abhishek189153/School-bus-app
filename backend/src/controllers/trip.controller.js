const Trip = require("../models/trip.model");
const Boarding =require("../models/boarding.model");


exports.startTrip = async (req, res) => {
  try {

    const { busId, tripType } = req.body;

    if (!busId) {
      return res.status(400).json({
        success: false,
        message: "Bus ID is required",
      });
    }

    if (!tripType) {
      return res.status(400).json({
        success: false,
        message: "Trip type is required",
      });
    }

    const activeTrip = await Trip.findOne({
      driverId: req.user.id,
      status: "STARTED",
    });

    if (activeTrip) {
      return res.status(400).json({
        success: false,
        message: "Complete current trip first",
      });
    }

    const trip = await Trip.create({
      schoolId: req.user.schoolId,
      busId,
      driverId: req.user.id,
      tripType,
      startTime: new Date(),
      status: "STARTED",
    });

    res.status(201).json({
      success: true,
      message: "Trip started successfully",
      trip,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.completeTrip =
async (req, res) => {

  try {

    const { tripId } = req.body;

    const trip =
      await Trip.findById(tripId);

    if (!trip) {

      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    trip.endTime = new Date();

    trip.status = "COMPLETED";

    await trip.save();

    res.status(200).json({
      success: true,
      trip,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTripDetails =
async (req, res) => {

    try {

        const { tripId } = req.params;

        const boardedStudents =
            await Boarding.find({
                tripId
            })
            .populate("studentId");

        res.status(200).json({
            success: true,
            boardedStudents
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};