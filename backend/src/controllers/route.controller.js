const Route = require("../models/route.model");
const Bus = require("../models/bus.model");

exports.createRoute = async (req, res) => {

    try {

        const route =
            await Route.create({
                ...req.body,
                schoolId: req.user.schoolId,
            });

        res.status(201).json({
            success: true,
            route,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getRoutes = async (req, res) => {

    try {

        const routes =
            await Route.find({
                schoolId: req.user.schoolId,
            });

        const buses =
            await Bus.find({
                schoolId: req.user.schoolId,
            });

        const routesWithStatus =
            routes.map((route) => {

                const assignedBus =
                    buses.find(
                        (bus) =>
                            bus.routeId?.toString() ===
                            route._id.toString()
                    );

                return {
                    ...route.toObject(),
                    isAssigned:
                        !!assignedBus,
                    assignedBus:
                        assignedBus?.busNumber || null,
                };
            });

        res.status(200).json({
            success: true,
            routes: routesWithStatus,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getRouteById = async (req, res) => {

    try {

        const route =
            await Route.findById(
                req.params.id
            );

        if (!route) {

            return res.status(404).json({
                success: false,
                message: "Route not found",
            });

        }

        if (
            route.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        res.status(200).json({
            success: true,
            route,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.updateRoute = async (req, res) => {

    try {

        const route =
            await Route.findById(
                req.params.id
            );

        if (!route) {

            return res.status(404).json({
                success: false,
                message: "Route not found",
            });

        }

        if (
            route.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        const updatedRoute =
            await Route.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                }
            );

        res.status(200).json({
            success: true,
            route: updatedRoute,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.deleteRoute = async (req, res) => {

    try {

        const route =
            await Route.findById(
                req.params.id
            );

        if (!route) {

            return res.status(404).json({
                success: false,
                message: "Route not found",
            });

        }

        if (
            route.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        const assignedBus =
            await Bus.findOne({
                routeId: req.params.id,
            });

        if (assignedBus) {

            return res.status(400).json({
                success: false,
                message:
                    "Route is assigned to a bus. Unassign first.",
            });

        }

        await Route.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message:
                "Route deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};