const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Bus = require("../models/bus.model");

exports.createDriver = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password,
        } = req.body;

        // ==========================================
        // EMAIL REQUIRED
        // ==========================================

        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Email is required",
            });

        }

        const normalizedEmail =
            email.trim().toLowerCase();


        // ==========================================
        // CHECK DUPLICATE PHONE
        // ==========================================

        // const existingUser =
        //     await User.findOne({
        //         phone,
        //     });

        // if (existingUser) {

        //     return res.status(400).json({
        //         success: false,
        //         message:
        //             "Another user already has the same number",
        //     });

        // }

        const existingUser =
    await User.findOne({
        phone,
        schoolId: req.user.schoolId,
    });

if (existingUser) {
    return res.status(400).json({
        success: false,
        message:
            "Another user in this school already has the same number",
    });
}


        // ==========================================
        // CHECK DUPLICATE EMAIL
        // ==========================================

        // const existingEmail =
        //     await User.findOne({
        //         email:
        //             normalizedEmail,
        //     });

        // if (existingEmail) {

        //     return res.status(400).json({
        //         success: false,
        //         message:
        //             "Another user already has the same email",
        //     });

        // }

        const existingEmail =
    await User.findOne({
        email: normalizedEmail,
        schoolId: req.user.schoolId,
    });

if (existingEmail) {
    return res.status(400).json({
        success: false,
        message:
            "Another user in this school already has the same email",
    });
}


        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ==========================================
        // CREATE DRIVER
        // ==========================================

        const driver =
            await User.create({

                name,

                email:
                    normalizedEmail,

                phone,

                password:
                    hashedPassword,

                role:
                    "DRIVER",

                schoolId:
                    req.user.schoolId,

            });


        // ==========================================
        // REMOVE PASSWORD FROM RESPONSE
        // ==========================================

        const driverResponse =
            driver.toObject();

        delete driverResponse.password;


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json({

            success: true,

            driver:
                driverResponse,

        });

    } catch (error) {

        console.log(
            "CREATE DRIVER ERROR:",
            error
        );


        // Duplicate key safety
        if (
            error.code === 11000
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Another user already has the same email or number",

            });

        }


        res.status(500).json({

            success: false,

            message:
                error.message,

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

        const buses =
            await Bus.find({
                schoolId: req.user.schoolId,
            });

        const driversWithStatus =
            drivers.map((driver) => {

                const assignedBus =
                    buses.find(
                        (bus) =>
                            bus.driverId?.toString() ===
                            driver._id.toString()
                    );

                return {
                    ...driver.toObject(),
                    isAssigned:
                        !!assignedBus,
                    assignedBus:
                        assignedBus?.busNumber || null,
                };
            });

        res.status(200).json({
            success: true,
            drivers: driversWithStatus,
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


        // ==========================================
        // DRIVER CHECK
        // ==========================================

        if (!driver) {

            return res.status(404).json({

                success: false,

                message:
                    "Driver not found",

            });

        }


        // ==========================================
        // SCHOOL ACCESS CHECK
        // ==========================================

        if (
            driver.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Access denied",

            });

        }


        // ==========================================
        // CHECK DUPLICATE PHONE
        // ==========================================

        if (req.body.phone) {

            const existingUser =
    await User.findOne({
        phone: req.body.phone,
        schoolId: req.user.schoolId,
        _id: {
            $ne: req.params.id,
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


        // ==========================================
        // CHECK DUPLICATE EMAIL
        // ==========================================

        let normalizedEmail =
            undefined;


        if (req.body.email) {

            normalizedEmail =
                req.body.email
                    .trim()
                    .toLowerCase();


           const existingEmail =
    await User.findOne({
        email: normalizedEmail,
        schoolId: req.user.schoolId,
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


        // ==========================================
        // UPDATE DRIVER
        // ==========================================

        const updateData = {

            name:
                req.body.name,

            phone:
                req.body.phone,

        };


        // Only update email when provided
        if (
            normalizedEmail !==
            undefined
        ) {

            updateData.email =
                normalizedEmail;

        }


        const updatedDriver =
            await User.findByIdAndUpdate(

                req.params.id,

                updateData,

                {
                    new: true,
                    runValidators: true,
                }

            ).select("-password");


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({

            success: true,

            driver:
                updatedDriver,

        });

    } catch (error) {

        console.log(
            "UPDATE DRIVER ERROR:",
            error
        );


        // Mongo duplicate key safety
        if (
            error.code === 11000
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Another user already has the same email or number",

            });

        }


        res.status(500).json({

            success: false,

            message:
                error.message,

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

        const assignedBus =
            await Bus.findOne({
                driverId: req.params.id,
            });

        if (assignedBus) {

            return res.status(400).json({
                success: false,
                message:
                    "Driver is assigned to a bus. Unassign first.",
            });

        }

        await Bus.updateMany(
            {
                driverId: req.params.id,
            },
            {
                $unset: {
                    driverId: "",
                },
            }
        );

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