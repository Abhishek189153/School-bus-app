const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

exports.createParent = async (req, res) => {

    try {

        const {
            name,
            phone,
            password,
            schoolId
        } = req.body;

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const parent =
            await User.create({
                name,
                phone,
                password: hashedPassword,
                role: "PARENT",
                schoolId
            });

        res.status(201).json({
            success: true,
            parent
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};