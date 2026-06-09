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
        type: String,
         unique: true,
         sparse: true
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus"
},

    routeId: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "Route",
},

    pickupStop: {
    type: String
}

}, {
    timestamps: true
});

module.exports =
mongoose.model("Student", studentSchema);