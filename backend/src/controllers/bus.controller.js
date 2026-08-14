const Bus = require("../models/bus.model");
const Student = require("../models/student.model");
const Route = require("../models/route.model");
const BusRoute = require("../models/busRoute.model");

exports.createBus = async (req, res) => {

    try {

        const bus =
            await Bus.create({
                ...req.body,
                schoolId: req.user.schoolId,
            });

        res.status(201).json({
            success: true,
            bus,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getBuses = async (req, res) => {

    try {

        const buses =
            await Bus.find({
                schoolId: req.user.schoolId,
            })
            .populate(
                "driverId",
                "name phone"
            )
            .populate(
                "routeId",
                "routeName"
            );

        res.status(200).json({
            success: true,
            buses,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getBusById = async (req, res) => {

    try {

        const bus =
            await Bus.findById(
                req.params.id
            );

        if (!bus) {

            return res.status(404).json({
                success: false,
                message: "Bus not found",
            });

        }

        if (
            bus.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        res.status(200).json({
            success: true,
            bus,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.updateBus = async (req, res) => {

    try {

        const bus =
            await Bus.findById(
                req.params.id
            );

        if (!bus) {

            return res.status(404).json({
                success: false,
                message: "Bus not found",
            });

        }

        if (
            bus.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        const updatedBus =
            await Bus.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                }
            );

        res.status(200).json({
            success: true,
            bus: updatedBus,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.deleteBus = async (req, res) => {

    try {

        const bus =
            await Bus.findById(
                req.params.id
            );

        if (!bus) {

            return res.status(404).json({
                success: false,
                message: "Bus not found",
            });

        }

        if (
            bus.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        if (bus.driverId) {

            return res.status(400).json({
                success: false,
                message:
                    "Bus has a driver assigned. Unassign first.",
            });

        }

        if (bus.routeId) {

            return res.status(400).json({
                success: false,
                message:
                    "Bus has a route assigned. Unassign first.",
            });

        }

        const assignedStudent =
            await Student.findOne({
                busId: req.params.id,
            });

        if (assignedStudent) {

            return res.status(400).json({
                success: false,
                message:
                    "Students are assigned to this bus. Unassign first.",
            });

        }

        await Bus.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message:
                "Bus deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


exports.getBusOverview = async (req, res) => {
    try {

        // ==========================================
        // GET ALL BUSES OF THIS SCHOOL
        // ==========================================

        const buses =
            await Bus.find({
                schoolId:
                    req.user.schoolId,
            })
            .populate(
                "driverId",
                "name phone"
            )
            .populate(
                "routeId",
                "routeName tripType"
            );


        const result =
            await Promise.all(

                buses.map(
                    async (bus) => {

                        // ==========================================
                        // GET ADDITIONAL ROUTES
                        // ==========================================

                        const additionalRoutes =
                            await BusRoute.find({
                                busId:
                                    bus._id,
                            })
                            .populate(
                                "routeId",
                                "routeName tripType"
                            );


                        // ==========================================
                        // COMBINE PRIMARY + ADDITIONAL ROUTES
                        // ==========================================

                        const allRoutes = [];


                        // Primary Route
                        if (bus.routeId) {

                            allRoutes.push(
                                bus.routeId
                            );

                        }


                        // Additional Routes
                        additionalRoutes.forEach(
                            (item) => {

                                if (
                                    item.routeId
                                ) {

                                    allRoutes.push(
                                        item.routeId
                                    );

                                }

                            }
                        );


                        // ==========================================
                        // REMOVE DUPLICATE ROUTES
                        // ==========================================

                        const uniqueRoutes =
                            Array.from(

                                new Map(

                                    allRoutes.map(
                                        (route) => [
                                            route._id.toString(),
                                            route,
                                        ]
                                    )

                                ).values()

                            );


                        // ==========================================
                        // COUNT STUDENTS FOR EACH ROUTE
                        // ==========================================

                        const routeStudentCounts =
                            await Promise.all(

                                uniqueRoutes.map(
                                    async (route) => {

                                        const count =
                                            await Student.countDocuments({

                                                schoolId:
                                                    req.user.schoolId,

                                                $or: [

                                                    // ==================================
                                                    // PICKUP
                                                    // ==================================

                                                    {
                                                        pickupBusId:
                                                            bus._id,

                                                        pickupRouteId:
                                                            route._id,
                                                    },


                                                    // ==================================
                                                    // DROP
                                                    // ==================================

                                                    {
                                                        dropBusId:
                                                            bus._id,

                                                        dropRouteId:
                                                            route._id,
                                                    },

                                                ],

                                            });


                                        return {

                                            routeId:
                                                route._id.toString(),

                                            count,

                                        };

                                    }
                                )

                            );


                        // ==========================================
                        // RETURN BUS DATA
                        // ==========================================

                        return {

                            ...bus.toObject(),

                            additionalRoutes,

                            routeStudentCounts,

                        };

                    }
                )

            );


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({

            success: true,

            buses:
                result,

        });


    } catch (error) {

        console.log(
            "GET BUS OVERVIEW ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }
};