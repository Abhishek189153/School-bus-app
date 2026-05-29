const Trip = require("../models/trip.model");

exports.startTrip = async (req, res) => {

  try {

    const {
      busId
    } = req.body;

    const trip =
      await Trip.create({
        schoolId: req.user.schoolId,
        busId,
        driverId: req.user.id,
        startTime: new Date(),
        status: "STARTED",
      });

    res.status(201).json({
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