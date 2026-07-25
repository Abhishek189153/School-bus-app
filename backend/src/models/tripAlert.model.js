const mongoose = require("mongoose");

const tripAlertSchema =
  new mongoose.Schema({
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },

    stopName: String,

    approachingSent: {
      type: Boolean,
      default: false,
    },

    arrivedSent: {
      type: Boolean,
      default: false,
    },
  });

module.exports =
  mongoose.model(
    "TripAlert",
    tripAlertSchema
  );