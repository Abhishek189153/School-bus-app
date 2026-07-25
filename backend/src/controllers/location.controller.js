const BusLocation =
require("../models/busLocation.model");

const {
  processTripAlerts,
} = require(
  "../services/tripAlert.service"
);

const {
  getIO,
} = require("../sockets/socket");

exports.updateLocation =
async (req, res) => {

  console.log(
  "LOCATION UPDATE RECEIVED"
);

console.log(req.body);

  console.log(
  "LOCATION API CALLED"
);

  try {

    console.log(
  "==============="
);

console.log(
  "LOCATION UPDATE RECEIVEDD"
);

console.log(req.body);

console.log(
  "==============="
);

    const {
      busId,
      latitude,
      longitude,
    } = req.body;

    const location =
  await BusLocation.findOneAndUpdate(
    { busId },
    {
      latitude,
      longitude,
      updatedAt: new Date(),
    },
    {
      upsert: true,
      new: true,
    }
  );

try {

  await processTripAlerts(
    busId,
    latitude,
    longitude
  );

} catch (error) {

  console.log(
    "TRIP ALERT ERROR:",
    error.message
  );

}

const io = getIO();

io.emit(
  "busLocationUpdated",
  {
    busId,
    latitude,
    longitude,
  }
);
    res.status(200).json({
      success: true,
      location,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBusLocation =
async (req, res) => {

  try {

    const { busId } = req.params;

    const location =
      await BusLocation.findOne({
        busId,
      });

    res.status(200).json({
      success: true,
      location,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};