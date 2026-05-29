const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    dutyOnTime: {
      type: Date,
    },

    dutyOffTime: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["ON_DUTY", "OFF_DUTY"],
      default: "ON_DUTY",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);