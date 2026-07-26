const mongoose = require("mongoose");

const studentAttendanceSchema =
new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },

  tripType: {
    type: String,
    enum: [
        "PICKUP",
        "DROP"
    ],
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

  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },

  attendanceDate: {
    type: Date,
    required: true,
  },

  tripDate: {
  type: String,
  required: true,
},

  status: {
    type: String,
    enum: [
      "PRESENT",
      "ABSENT",
    ],
    required: true,
  },

}, {
  timestamps: true,
});

module.exports =
mongoose.model(
  "StudentAttendance",
  studentAttendanceSchema
);