const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    className: {
        type: String
    },

    admissionNumber: {
        type: String
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});

module.exports =
mongoose.model("Student", studentSchema);