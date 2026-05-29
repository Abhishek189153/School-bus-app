const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({

    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    routeName: {
        type: String,
        required: true
    },

    stops: [
        {
            stopName: String
        }
    ]

}, {
    timestamps: true
});

module.exports =
mongoose.model("Route", routeSchema);