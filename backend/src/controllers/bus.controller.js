const Bus = require("../models/bus.model");

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
            });

        res.status(200).json({
            success: true,
            buses,
        })
         .populate(
            "driverId",
            "name"
         )
         .populate(
            "routeId",
            "routeName"
        );

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