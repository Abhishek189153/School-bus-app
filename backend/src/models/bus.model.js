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
    },

    routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route"
}

}, {
    timestamps: true
});

// Index for faster dashboard school-wise bus counts
busSchema.index({ schoolId: 1 });

module.exports =
mongoose.model("Bus", busSchema);