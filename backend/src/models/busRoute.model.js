const mongoose = require("mongoose");

const busRouteSchema =
  new mongoose.Schema(
    {
      busId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Bus",
        required: true,
      },

      routeId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Route",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "BusRoute",
    busRouteSchema
  );