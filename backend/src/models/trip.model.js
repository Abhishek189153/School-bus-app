const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

     tripType: {
      type: String,
      enum: ["PICKUP", "DROP"],
      required: true,
    },

    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tripDate: {
  type: String,
},

    startTime: Date,

    endTime: Date,

    status: {
      type: String,
      enum: [
        "STARTED",
        "COMPLETED"
      ],
      default: "STARTED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("Trip", tripSchema);