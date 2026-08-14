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

  // ==========================================
// PICKUP TRANSPORT
// ==========================================

pickupBusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
},

pickupRouteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
},

pickupStop: {
    type: String,
},


// ==========================================
// DROP TRANSPORT
// ==========================================

dropBusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
},

dropRouteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
},

dropStop: {
    type: String,
},

boardedToday: {
  type: Boolean,
  default: false,
},

}, {
    timestamps: true
});

module.exports =
mongoose.model("Student", studentSchema);