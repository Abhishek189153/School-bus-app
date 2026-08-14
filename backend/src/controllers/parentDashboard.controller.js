const User = require("../models/user.model");
const Student = require("../models/student.model");
const Bus = require("../models/bus.model");
const Route = require("../models/route.model");
const Trip = require("../models/trip.model");
const BusLocation = require("../models/busLocation.model");

exports.getParentDashboard = async (req, res) => {

    console.log(
        "PARENT DASHBOARD CONTROLLER FILE HIT"
    );

    try {

        const parentId =
            req.user.id;


        // ==========================================
        // FIND STUDENT
        // ==========================================

        const student =
            await Student.findOne({
                parentId,
            })
            .populate(
                "pickupBusId"
            )
            .populate(
                "pickupRouteId"
            )
            .populate(
                "dropBusId"
            )
            .populate(
                "dropRouteId"
            );


        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student not found",

            });

        }


        // ==========================================
        // FIND ACTIVE TRIP
        //
        // Pickup → pickupBusId
        // Drop   → dropBusId
        // ==========================================

        const activeTrip =
            await Trip.findOne({

                schoolId:
                    req.user.schoolId,

                status:
                    "STARTED",

                $or: [

                    {
                        busId:
                            student.pickupBusId?._id,

                        tripType:
                            "PICKUP",
                    },

                    {
                        busId:
                            student.dropBusId?._id,

                        tripType:
                            "DROP",
                    },

                ],

            })
            .sort({
                startTime: -1,
            });


        console.log(
            "ACTIVE TRIP FOUND:",
            activeTrip
        );


        // ==========================================
        // DETERMINE ACTIVE BUS
        // ==========================================

        let bus = null;

        let route = null;


        if (activeTrip) {

            // --------------------------------------
            // ACTIVE TRIP BUS
            // --------------------------------------

            bus =
                await Bus.findById(
                    activeTrip.busId
                )
                .populate(
                    "driverId",
                    "name phone"
                );


            // --------------------------------------
            // ACTIVE TRIP ROUTE
            // --------------------------------------

            route =
                await Route.findById(
                    activeTrip.routeId
                );

        }


        // ==========================================
        // NO ACTIVE TRIP
        //
        // Use Pickup transport as default
        // ==========================================

        else {

            if (
                student.pickupBusId
            ) {

                bus =
                    await Bus.findById(
                        student.pickupBusId._id
                    )
                    .populate(
                        "driverId",
                        "name phone"
                    );

            }


            if (
                student.pickupRouteId
            ) {

                route =
                    await Route.findById(
                        student.pickupRouteId._id
                    );

            }

        }


        // ==========================================
        // LIVE LOCATION
        // ==========================================

        let liveLocation = null;


        if (bus?._id) {

            liveLocation =
                await BusLocation.findOne({

                    busId:
                        bus._id,

                });

        }


        // ==========================================
        // APPROACHING STOP
        // ==========================================

        let approachingStop = null;


        if (
            route &&
            route.stops?.length &&
            liveLocation
        ) {

            let nearestDistance =
                Number.MAX_VALUE;


            route.stops.forEach(
                (stop) => {

                    if (
                        typeof stop.latitude !==
                            "number" ||
                        typeof stop.longitude !==
                            "number"
                    ) {

                        return;

                    }


                    const distance =
                        Math.sqrt(

                            Math.pow(
                                stop.latitude -
                                liveLocation.latitude,
                                2
                            ) +

                            Math.pow(
                                stop.longitude -
                                liveLocation.longitude,
                                2
                            )

                        );


                    if (
                        distance <
                        nearestDistance
                    ) {

                        nearestDistance =
                            distance;

                        approachingStop =
                            stop.stopName;

                    }

                }
            );

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            data: {

                student,

                bus,

                route,

                activeTrip,

                liveLocation,

                approachingStop,

            },

        });


    } catch (error) {

        console.error(
            "PARENT DASHBOARD ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};