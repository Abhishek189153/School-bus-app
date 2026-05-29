const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({

    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    busNumber: {
        type: String,
        required: true
    },

    vehicleNumber: {
        type: String
    },

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});

module.exports =
mongoose.model("Bus", busSchema);