const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Student = require("../models/student.model");
const Bus = require("../models/bus.model");
const Trip = require("../models/trip.model");
const BusLocation = require("../models/busLocation.model");
const Route = require("../models/route.model");


exports.createParent = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password,
        } = req.body;

        const existingUser =
            await User.findOne({
                phone,
            });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message:
                    "Another user already has the same number",
            });

        }

        if (email) {

    const existingEmail =
        await User.findOne({
            email: email.toLowerCase(),
        });

    if (existingEmail) {

        return res.status(400).json({
            success: false,
            message:
                "Another user already has the same email",
        });

    }
}

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const parent =
            await User.create({
                name,
                email,
                phone,
                password:
                    hashedPassword,
                role:
                    "PARENT",
                schoolId:
                    req.user.schoolId,
            });

        const parentResponse =
            parent.toObject();

        delete parentResponse.password;

        res.status(201).json({
            success: true,
            parent:
                parentResponse,
        });

    } catch (error) {

        console.log(
            "CREATE PARENT ERROR:",
            error
        );

        if (
            error.code === 11000
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Another user already has the same number",
            });

        }

        res.status(500).json({
            success: false,
            message:
                error.message,
        });

    }

};

exports.getParents = async (req, res) => {

    try {

       const parents =
        await User.find({
            schoolId: req.user.schoolId,
            role: "PARENT",
        }).select("-password");

        const parentsWithStudents =
        await Promise.all(
            parents.map(
            async (parent) => {

                const students =
                    await Student.find({
                        parentId: parent._id,
                    });

                    return {
                    ...parent.toObject(),
                    studentName:
                        students.length > 0
                        ? students
                            .map(
                                (student) =>
                                `${student.name}(${student.admissionNumber})`
                            )
                            .join(", ")
                        : "N/A",
                    };
            }
            )
        );

        res.status(200).json({
        success: true,
        parents: parentsWithStudents,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getParentById = async (req, res) => {

    try {

        const parent =
            await User.findById(
                req.params.id
            ).select("-password");

        if (!parent) {

            return res.status(404).json({
                success: false,
                message: "Parent not found",
            });

        }

        if (
            parent.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        res.status(200).json({
            success: true,
            parent,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.updateParent = async (req, res) => {

    try {

        const parent =
            await User.findById(
                req.params.id
            );

        if (!parent) {

            return res.status(404).json({
                success: false,
                message:
                    "Parent not found",
            });

        }

        if (
            parent.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Access denied",
            });

        }

        // Check duplicate phone
        if (req.body.phone) {

            const existingUser =
                await User.findOne({
                    phone:
                        req.body.phone,
                    _id: {
                        $ne:
                            req.params.id,
                    },
                });

            if (existingUser) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Another user already has the same number",
                });

            }

        }

        // Check duplicate email
if (req.body.email) {

    const existingEmail =
        await User.findOne({
            email:
                req.body.email.toLowerCase(),

            _id: {
                $ne: req.params.id,
            },
        });

    if (existingEmail) {

        return res.status(400).json({
            success: false,
            message:
                "Another user already has the same email",
        });

    }
}

        const updatedParent =
            await User.findByIdAndUpdate(
                req.params.id,
                {
                    name:
                        req.body.name,
                     email:
                        req.body.email,    
                    phone:
                        req.body.phone,
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).select("-password");

        res.status(200).json({
            success: true,
            parent:
                updatedParent,
        });

    } catch (error) {

        console.log(
            "UPDATE PARENT ERROR:",
            error
        );

        if (
            error.code === 11000
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Another user already has the same number",
            });

        }

        res.status(500).json({
            success: false,
            message:
                error.message,
        });

    }

};

exports.deleteParent = async (req, res) => {

    try {

        const parent =
            await User.findById(
                req.params.id
            );

        if (!parent) {

            return res.status(404).json({
                success: false,
                message: "Parent not found",
            });

        }

        if (
            parent.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        await User.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message:
                "Parent deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


exports.getParentDashboard = async (req, res) => {

    console.log(
        "Parent Dashboard File Hit"
    );

    try {

        const parent =
            await User.findById(
                req.user.id
            );

        if (!parent) {

            return res.status(404).json({
                success: false,
                message: "Parent not found",
            });

        }


        // ==========================================
        // FIND STUDENTS
        // ==========================================

        const students =
            await Student.find({
                parentId: parent._id,
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


        if (!students.length) {

            return res.status(404).json({
                success: false,
                message: "No student found",
            });

        }


        const firstStudent =
            students[0];


        // ==========================================
        // FIND ACTIVE TRIP
        // ==========================================

        const activeTrip =
            await Trip.findOne({

                schoolId:
                    req.user.schoolId,

                status:
                    "STARTED",

                $or: [

                    // PICKUP
                    {
                        busId:
                            firstStudent
                                .pickupBusId
                                ?._id,

                        tripType:
                            "PICKUP",

                        routeId:
                            firstStudent
                                .pickupRouteId
                                ?._id,
                    },

                    // DROP
                    {
                        busId:
                            firstStudent
                                .dropBusId
                                ?._id,

                        tripType:
                            "DROP",

                        routeId:
                            firstStudent
                                .dropRouteId
                                ?._id,
                    },

                ],

            })
            .sort({
                startTime: -1,
            });


        console.log(
            "ACTIVE TRIP:",
            activeTrip
        );


        // ==========================================
        // DETERMINE CURRENT TRANSPORT
        // ==========================================

        let bus = null;

        let route = null;

        let currentStop = null;


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


            // --------------------------------------
            // ACTIVE STUDENT STOP
            // --------------------------------------

            if (
                activeTrip.tripType ===
                "PICKUP"
            ) {

                currentStop =
                    firstStudent.pickupStop;

            } else if (
                activeTrip.tripType ===
                "DROP"
            ) {

                currentStop =
                    firstStudent.dropStop;

            }

        } else {

            // ======================================
            // NO ACTIVE TRIP
            //
            // Use PICKUP as default
            // ======================================

            if (
                firstStudent.pickupBusId
            ) {

                bus =
                    await Bus.findById(
                        firstStudent
                            .pickupBusId
                            ._id
                    )
                    .populate(
                        "driverId",
                        "name phone"
                    );

            }


            if (
                firstStudent.pickupRouteId
            ) {

                route =
                    await Route.findById(
                        firstStudent
                            .pickupRouteId
                            ._id
                    );

            }


            currentStop =
                firstStudent.pickupStop;

        }


        // ==========================================
        // LIVE BUS LOCATION
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
        // FIND APPROACHING STOP
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


        console.log(
            "APPROACHING STOP:",
            approachingStop
        );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            boardingStatus:

                students.map(
                    (student) => ({

                        name:
                            student.name,

                        boardedToday:
                            student.boardedToday,

                    })
                ),


            studentName:
                firstStudent.name,


            // ======================================
            // CURRENT TRANSPORT
            // ======================================

            tripType:
                activeTrip?.tripType ||
                "PICKUP",


            routeName:
                route?.routeName,


            pickupStop:
                firstStudent.pickupStop,


            dropStop:
                firstStudent.dropStop,


            currentStop,


            busNumber:
                bus?.busNumber,


            vehicleNumber:
                bus?.vehicleNumber,


            driverName:
                bus?.driverId?.name,


            driverPhone:
                bus?.driverId?.phone,


            totalStudents:
                students.length,


            students,


            activeTrip,


            liveLocation,


            approachingStop,


            boardedToday:
                firstStudent.boardedToday,

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