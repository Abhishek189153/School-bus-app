const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

exports.createDriver = async (req, res) => {

    try {

        const {
            name,
            phone,
            password,
            schoolId
        } = req.body;

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const driver =
            await User.create({
                name,
                phone,
                password: hashedPassword,
                role: "DRIVER",
                schoolId
            });

        res.status(201).json({
            success: true,
            driver
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};