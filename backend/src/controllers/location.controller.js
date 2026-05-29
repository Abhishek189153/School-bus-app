const BusLocation =
require("../models/busLocation.model");

const {
  getIO,
} = require("../sockets/socket");

exports.updateLocation =
async (req, res) => {

  try {

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

    const io = getIO();

    io.emit("busLocationUpdated", {
      busId,
      latitude,
      longitude,
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