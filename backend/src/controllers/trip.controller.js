const Trip = require("../models/trip.model");
const Boarding =require("../models/boarding.model");

const Student =require("../models/student.model");

const User =require("../models/user.model");

const {createNotification,} = require("../services/inAppNotification.service");

const {sendPushNotification,} = require("../services/notification.service");

exports.startTrip = async (req, res) => {
  try {

    const { busId, tripType } = req.body;

    console.log("Received Route ID:", routeId);

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

    console.log(trip);

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

    const students =
await Student.find({
  busId: trip.busId,
});

for (const student of students) {

  const parent =
    await User.findById(
      student.parentId
    );

  const message =
    trip.tripType === "PICKUP"
      ? "Bus has safely reached school."
      : "Bus has completed the return journey.";

  await createNotification({
    schoolId: student.schoolId,
    recipientId: parent._id,
    title: "Trip Completed",
    message,
    type: "TRIP_COMPLETE",
  });

  if (parent?.fcmToken) {

    await sendPushNotification({
      token: parent.fcmToken,
      title: "Trip Completed",
      body: message,
    });

  }
}

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