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

    tripType: {
  type: String,
  enum: ["PICKUP", "DROP"],
  required: true,
},

scheduledTime: {
  type: String,
  required: true,
},

 status: {
    type: Boolean,
    default: true,
  },

  reActivatedAt: {
  type: Date,
},

    stops: [
  {
    stopName: {
      type: String,
      required: true,
    },

    latitude: Number,

    longitude: Number,
  },
]

}, {
    timestamps: true
});

module.exports =
mongoose.model("Route", routeSchema);