const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
    {
        schoolName: {
            type: String,
            required: true,
        },

        address: {
            type: String,
        },

        phone: {
            type: String,
        },

        email: {
            type: String,
        },

        subscriptionStatus: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("School", schoolSchema);