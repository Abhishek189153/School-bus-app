const Student = require("../models/student.model");
const Route = require("../models/route.model");
const Bus = require("../models/bus.model");
const BusRoute = require("../models/busRoute.model");


// =====================================================
// HELPER
// Check whether a bus is assigned to a route
// =====================================================

const isBusAssignedToRoute = async (
    busId,
    routeId,
    schoolId
) => {

    // Check primary route
    const primaryAssignment =
        await Bus.findOne({
            _id: busId,
            schoolId: schoolId,
            routeId: routeId,
        });

    if (primaryAssignment) {
        return true;
    }


    // Check additional routes
    const additionalAssignment =
        await BusRoute.findOne({
            busId: busId,
            routeId: routeId,
        });

    if (additionalAssignment) {
        return true;
    }


    return false;
};


// =====================================================
// CREATE STUDENT
// =====================================================

exports.createStudent = async (req, res) => {

    try {

        const {
            name,
            className,
            admissionNumber,
            parentId,

            pickupRouteId,
            pickupBusId,
            pickupStop,

            dropRouteId,
            dropBusId,
            dropStop,

        } = req.body;


        // ==========================================
        // BASIC VALIDATION
        // ==========================================

        if (!name) {

            return res.status(400).json({
                success: false,
                message:
                    "Student name is required",
            });

        }


        // ==========================================
        // PICKUP ROUTE VALIDATION
        // ==========================================

        if (pickupRouteId) {

            const pickupRoute =
                await Route.findById(
                    pickupRouteId
                );

            if (!pickupRoute) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Pickup route not found",
                });

            }


            if (
                pickupRoute.schoolId.toString() !==
                req.user.schoolId.toString()
            ) {

                return res.status(403).json({
                    success: false,
                    message:
                        "Pickup route belongs to another school",
                });

            }


            if (
                pickupRoute.tripType !==
                "PICKUP"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Selected pickup route must be a PICKUP route",
                });

            }


            // ======================================
            // PICKUP BUS VALIDATION
            // ======================================

            if (pickupBusId) {

                const pickupBus =
                    await Bus.findById(
                        pickupBusId
                    );

                if (!pickupBus) {

                    return res.status(404).json({
                        success: false,
                        message:
                            "Pickup bus not found",
                    });

                }


                if (
                    pickupBus.schoolId.toString() !==
                    req.user.schoolId.toString()
                ) {

                    return res.status(403).json({
                        success: false,
                        message:
                            "Pickup bus belongs to another school",
                    });

                }


                const assigned =
                    await isBusAssignedToRoute(
                        pickupBusId,
                        pickupRouteId,
                        req.user.schoolId
                    );

                if (!assigned) {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Selected pickup bus is not assigned to the selected pickup route",
                    });

                }

            }

        }


        // ==========================================
        // DROP ROUTE VALIDATION
        // ==========================================

        if (dropRouteId) {

            const dropRoute =
                await Route.findById(
                    dropRouteId
                );

            if (!dropRoute) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Drop route not found",
                });

            }


            if (
                dropRoute.schoolId.toString() !==
                req.user.schoolId.toString()
            ) {

                return res.status(403).json({
                    success: false,
                    message:
                        "Drop route belongs to another school",
                });

            }


            if (
                dropRoute.tripType !==
                "DROP"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Selected drop route must be a DROP route",
                });

            }


            // ======================================
            // DROP BUS VALIDATION
            // ======================================

            if (dropBusId) {

                const dropBus =
                    await Bus.findById(
                        dropBusId
                    );

                if (!dropBus) {

                    return res.status(404).json({
                        success: false,
                        message:
                            "Drop bus not found",
                    });

                }


                if (
                    dropBus.schoolId.toString() !==
                    req.user.schoolId.toString()
                ) {

                    return res.status(403).json({
                        success: false,
                        message:
                            "Drop bus belongs to another school",
                    });

                }


                const assigned =
                    await isBusAssignedToRoute(
                        dropBusId,
                        dropRouteId,
                        req.user.schoolId
                    );

                if (!assigned) {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Selected drop bus is not assigned to the selected drop route",
                    });

                }

            }

        }


        // ==========================================
        // CREATE STUDENT
        // ==========================================

        const student =
            await Student.create({

                name,

                className,

                admissionNumber,

                parentId,

                pickupRouteId,

                pickupBusId,

                pickupStop,

                dropRouteId,

                dropBusId,

                dropStop,

                schoolId:
                    req.user.schoolId,

            });


        return res.status(201).json({

            success: true,

            student,

        });


    } catch (error) {

        console.error(
            "CREATE STUDENT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


// =====================================================
// GET ALL STUDENTS
// =====================================================

exports.getStudents = async (
    req,
    res
) => {

    try {

        const students =
            await Student.find({

                schoolId:
                    req.user.schoolId,

            })

            .populate(
                "parentId",
                "name phone"
            )

            .populate(
                "pickupBusId",
                "busNumber vehicleNumber"
            )

            .populate(
                "pickupRouteId",
                "routeName tripType scheduledTime"
            )

            .populate(
                "dropBusId",
                "busNumber vehicleNumber"
            )

            .populate(
                "dropRouteId",
                "routeName tripType scheduledTime"
            );


        return res.status(200).json({

            success: true,

            students,

        });


    } catch (error) {

        console.error(
            "GET STUDENTS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


// =====================================================
// GET STUDENT BY ID
// =====================================================

exports.getStudentById = async (
    req,
    res
) => {

    try {

        const student =
            await Student.findById(
                req.params.id
            )

            .populate(
                "parentId",
                "name phone"
            )

            .populate(
                "pickupBusId",
                "busNumber vehicleNumber"
            )

            .populate(
                "pickupRouteId",
                "routeName tripType scheduledTime"
            )

            .populate(
                "dropBusId",
                "busNumber vehicleNumber"
            )

            .populate(
                "dropRouteId",
                "routeName tripType scheduledTime"
            );


        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student not found",

            });

        }


        if (
            student.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Access denied",

            });

        }


        return res.status(200).json({

            success: true,

            student,

        });


    } catch (error) {

        console.error(
            "GET STUDENT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


// =====================================================
// UPDATE STUDENT
// =====================================================

exports.updateStudent = async (
    req,
    res
) => {

    try {

        const student =
            await Student.findById(
                req.params.id
            );


        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student not found",

            });

        }


        // ==========================================
        // SCHOOL CHECK
        // ==========================================

        if (
            student.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Access denied",

            });

        }


        const {
            pickupRouteId,
            pickupBusId,

            dropRouteId,
            dropBusId,

        } = req.body;


        // ==========================================
        // VALIDATE PICKUP
        // ==========================================

        if (pickupRouteId) {

            const pickupRoute =
                await Route.findById(
                    pickupRouteId
                );


            if (!pickupRoute) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Pickup route not found",

                });

            }


            if (
                pickupRoute.schoolId.toString() !==
                req.user.schoolId.toString()
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Pickup route belongs to another school",

                });

            }


            if (
                pickupRoute.tripType !==
                "PICKUP"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Selected pickup route must be a PICKUP route",

                });

            }


            if (pickupBusId) {

                const pickupBus =
                    await Bus.findById(
                        pickupBusId
                    );


                if (!pickupBus) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Pickup bus not found",

                    });

                }


                if (
                    pickupBus.schoolId.toString() !==
                    req.user.schoolId.toString()
                ) {

                    return res.status(403).json({

                        success: false,

                        message:
                            "Pickup bus belongs to another school",

                    });

                }


                const assigned =
                    await isBusAssignedToRoute(
                        pickupBusId,
                        pickupRouteId,
                        req.user.schoolId
                    );


                if (!assigned) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Selected pickup bus is not assigned to the selected pickup route",

                    });

                }

            }

        }


        // ==========================================
        // VALIDATE DROP
        // ==========================================

        if (dropRouteId) {

            const dropRoute =
                await Route.findById(
                    dropRouteId
                );


            if (!dropRoute) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Drop route not found",

                });

            }


            if (
                dropRoute.schoolId.toString() !==
                req.user.schoolId.toString()
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Drop route belongs to another school",

                });

            }


            if (
                dropRoute.tripType !==
                "DROP"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Selected drop route must be a DROP route",

                });

            }


            if (dropBusId) {

                const dropBus =
                    await Bus.findById(
                        dropBusId
                    );


                if (!dropBus) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Drop bus not found",

                    });

                }


                if (
                    dropBus.schoolId.toString() !==
                    req.user.schoolId.toString()
                ) {

                    return res.status(403).json({

                        success: false,

                        message:
                            "Drop bus belongs to another school",

                    });

                }


                const assigned =
                    await isBusAssignedToRoute(
                        dropBusId,
                        dropRouteId,
                        req.user.schoolId
                    );


                if (!assigned) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Selected drop bus is not assigned to the selected drop route",

                    });

                }

            }

        }


        // ==========================================
        // UPDATE STUDENT
        // ==========================================

        const updatedStudent =
            await Student.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true,
                }

            )

            .populate(
                "parentId",
                "name phone"
            )

            .populate(
                "pickupBusId",
                "busNumber vehicleNumber"
            )

            .populate(
                "pickupRouteId",
                "routeName tripType scheduledTime"
            )

            .populate(
                "dropBusId",
                "busNumber vehicleNumber"
            )

            .populate(
                "dropRouteId",
                "routeName tripType scheduledTime"
            );


        return res.status(200).json({

            success: true,

            student:
                updatedStudent,

        });


    } catch (error) {

        console.error(
            "UPDATE STUDENT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


// =====================================================
// DELETE STUDENT
// =====================================================

exports.deleteStudent = async (
    req,
    res
) => {

    try {

        const student =
            await Student.findById(
                req.params.id
            );


        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student not found",

            });

        }


        if (
            student.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Access denied",

            });

        }


        await Student.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Student deleted successfully",

        });


    } catch (error) {

        console.error(
            "DELETE STUDENT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};