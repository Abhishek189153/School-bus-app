const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

exports.createSchoolAdmin = async (req, res) => {

    try {

        const {
            name,
            phone,
            password,
            schoolId
        } = req.body;

        const existingUser = await User.findOne({ phone });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name,
            phone,
            password: hashedPassword,
            role: "SCHOOL_ADMIN",
            schoolId
        });

        res.status(201).json({
            success: true,
            admin
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};