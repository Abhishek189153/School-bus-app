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

    // YYYY-MM-DD
    tripDate: {
        type: String,
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
        enum: ["PRESENT", "ABSENT"],
        default: "PRESENT",
    },
},
{
    timestamps: true,
}
);

module.exports =
mongoose.model(
    "Attendance",
    attendanceSchema
);