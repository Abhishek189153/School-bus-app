const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            default: null,
        },

        email: {
            type: String,
            default: null,
            lowercase: true,
            trim: true,
        },

        otp: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Otp",
    otpSchema
);