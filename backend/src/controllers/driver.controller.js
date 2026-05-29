const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

exports.createDriver = async (req, res) => {

    try {

        const {
            name,
            phone,
            password,
        } = req.body;

        const existingDriver =
            await User.findOne({
                phone,
            });

        if (existingDriver) {

            return res.status(400).json({
                success: false,
                message: "Driver already exists",
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const driver =
            await User.create({
                name,
                phone,
                password: hashedPassword,
                role: "DRIVER",
                schoolId: req.user.schoolId,
            });

        const driverResponse =
            driver.toObject();

        delete driverResponse.password;

        res.status(201).json({
            success: true,
            driver: driverResponse,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getDrivers = async (req, res) => {

    try {

        const drivers =
            await User.find({
                schoolId: req.user.schoolId,
                role: "DRIVER",
            }).select("-password");

        res.status(200).json({
            success: true,
            drivers,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getDriverById = async (req, res) => {

    try {

        const driver =
            await User.findById(
                req.params.id
            ).select("-password");

        if (!driver) {

            return res.status(404).json({
                success: false,
                message: "Driver not found",
            });

        }

        if (
            driver.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        res.status(200).json({
            success: true,
            driver,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.updateDriver = async (req, res) => {

    try {

        const driver =
            await User.findById(
                req.params.id
            );

        if (!driver) {

            return res.status(404).json({
                success: false,
                message: "Driver not found",
            });

        }

        if (
            driver.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        const updatedDriver =
            await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                }
            ).select("-password");

        res.status(200).json({
            success: true,
            driver: updatedDriver,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.deleteDriver = async (req, res) => {

    try {

        const driver =
            await User.findById(
                req.params.id
            );

        if (!driver) {

            return res.status(404).json({
                success: false,
                message: "Driver not found",
            });

        }

        if (
            driver.schoolId.toString() !==
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
                "Driver deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};