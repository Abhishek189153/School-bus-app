const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

exports.createParent = async (req, res) => {

    try {

        const {
            name,
            phone,
            password,
        } = req.body;

        const existingParent =
            await User.findOne({
                phone,
            });

        if (existingParent) {

            return res.status(400).json({
                success: false,
                message: "Parent already exists",
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const parent =
            await User.create({
                name,
                phone,
                password: hashedPassword,
                role: "PARENT",
                schoolId: req.user.schoolId,
            });

        const parentResponse =
            parent.toObject();

        delete parentResponse.password;

        res.status(201).json({
            success: true,
            parent: parentResponse,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
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

        res.status(200).json({
            success: true,
            parents,
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

        const updatedParent =
            await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                }
            ).select("-password");

        res.status(200).json({
            success: true,
            parent: updatedParent,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
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