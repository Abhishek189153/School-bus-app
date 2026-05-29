const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
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
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);