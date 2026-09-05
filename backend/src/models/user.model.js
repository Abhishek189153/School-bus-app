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
        trim: true,
        lowercase: true,
        sparse: true,
        },

        resetPasswordOTP: {
            type: String,
            default: null,
        },

        resetPasswordOTPExpires: {
            type: Date,
            default: null,
        },

        resetPasswordOTPVerified: {
            type: Boolean,
            default: false,
        },

        phone: {
            type: String,
            required: true,
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

userSchema.index(
    { schoolId: 1, phone: 1 },
    {
        unique: true,
        partialFilterExpression: {
            schoolId: { $exists: true },
            phone: { $exists: true },
        },
    }
);

userSchema.index(
    { schoolId: 1, email: 1 },
    {
        unique: true,
        partialFilterExpression: {
            schoolId: { $exists: true },
            email: { $exists: true },
        },
    }
);

module.exports = mongoose.model("User", userSchema);