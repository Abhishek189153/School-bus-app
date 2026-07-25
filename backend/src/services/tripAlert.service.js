const Student =
require("../models/student.model");

const User =
require("../models/user.model");

const Trip =
require("../models/trip.model");

const Route =
require("../models/route.model");

const TripAlert =
require("../models/tripAlert.model");

const {
  calculateDistance,
} =
require("../utils/distance");

const {
  sendNotification,
} =
require("./pushNotification.service");


exports.processTripAlerts =
async (
  busId,
  latitude,
  longitude
) => {

  const trip =
    await Trip.findOne({
      busId,
      status: "STARTED",
    });

  if (!trip) return;

  const students =
    await Student.find({
      busId,
    });

  const route =
    await Route.findById(
      trip.routeId
    );

  for (
    const student
    of students
  ) {

    const stop =
      route.stops.find(
        s =>
          s.stopName ===
          student.pickupStop
      );

    if (!stop) continue;

    const distance =
      calculateDistance(
        latitude,
        longitude,
        stop.latitude,
        stop.longitude
      );

    let alert =
      await TripAlert.findOne({
        tripId: trip._id,
        stopName:
          stop.stopName,
      });

    if (!alert) {

      alert =
        await TripAlert.create({
          tripId: trip._id,
          stopName:
            stop.stopName,
        });

    }

    const parent =
      await User.findById(
        student.parentId
      );

    if (
      !parent?.expoPushToken
    )
      continue;

    /*
      APPROACHING
    */

    if (
      distance <= 500 &&
      !alert.approachingSent
    ) {

      if (
  parent?.expoPushToken &&
  parent?.notificationSettings?.tripAlerts
) {

  await sendNotification(
    parent.expoPushToken,
    "🚌 Get Ready",
   `Bus will reach ${stop.stopName} shortly`
  );

}

      alert.approachingSent =
        true;

      await alert.save();
    }

    /*
      ARRIVED
    */

    if (
      distance <= 50 &&
      !alert.arrivedSent
    ) {

     if (
  parent?.expoPushToken &&
  parent?.notificationSettings?.tripAlerts
) {

  await sendNotification(
    parent.expoPushToken,
    "📍 Bus Arrived",
    `Bus has reached ${stop.stopName}`
  );

}

      alert.arrivedSent =
        true;

      await alert.save();
    }
  }
};