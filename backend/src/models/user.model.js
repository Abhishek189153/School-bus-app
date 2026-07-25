const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        profileImage: {
            type: String,
            default: "",
            },

        email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: [
                "SUPER_ADMIN",
                "SCHOOL_ADMIN",
                "DRIVER",
                "PARENT",
            ],
            required: true,
        },

        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
        },

        fcmToken: {
            type: String,
            default: null,
        },

        notificationSettings: {

        tripAlerts: {
            type: Boolean,
            default: true,
        },

        boardingAlerts: {
            type: Boolean,
            default: true,
        },

        },

        expoPushToken: {
        type: String,
        },

        isFirstLogin: {
        type: Boolean,
        default: true,
    },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);