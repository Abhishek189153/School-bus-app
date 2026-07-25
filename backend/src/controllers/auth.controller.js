const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const Otp = require("../models/otp.model");

const School = require("../models/school.model");

const { sendMail } = require("../utils/mail.service");

// Register
exports.register = async (req, res) => {

    try {

        const {

            name,

            email,

            phone,

            password,

            role,

        } = req.body;

        // Check Phone
        const existingPhone = await User.findOne({

            phone,

        });

        if (existingPhone) {

            return res.status(400).json({

                success: false,

                message: "Phone number already registered",

            });

        }

        // Check Email
        const existingEmail = await User.findOne({

            email,

        });

        if (existingEmail) {

            return res.status(400).json({

                success: false,

                message: "Email already registered",

            });

        }

        const hashedPassword = await bcrypt.hash(

            password,

            10

        );

        const user = await User.create({

            name,

            email,

            phone,

            password: hashedPassword,

            role,

        });

        res.status(201).json({

            success: true,

            message: "User registered successfully",

            user,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// Login
exports.login = async (req, res) => {
    try {

        const { phone, password } = req.body;

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                schoolId: user.schoolId,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

       res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
                isFirstLogin: user.isFirstLogin,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Change Password (First Login)
exports.changePassword = async (req, res) => {

    try {

        const { newPassword } = req.body;

        if (!newPassword) {

            return res.status(400).json({
                success: false,
                message: "New password is required",
            });

        }

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found",
            });

        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;
        user.isFirstLogin = false;

        await user.save();

        res.status(200).json({

            success: true,

            message: "Password changed successfully",

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};


exports.forgotPassword = async (req, res) => {

    try {

        const { phone } = req.body;

        if (!phone) {

            return res.status(400).json({

                success: false,

                message: "Phone number is required",

            });

        }

        const user = await User.findOne({

    phone,

    role: {

        $in: [

            "SUPER_ADMIN",

            "SCHOOL_ADMIN",

        ],

    },

});

        if (!user) {

    return res.status(404).json({

        success: false,

        message: "No User found with this phone number.",

    });

}

       let receiverEmail;

if (user.role === "SUPER_ADMIN") {

    receiverEmail = user.email;

} else {

    const school = await School.findById(user.schoolId);

    if (!school) {

        return res.status(404).json({

            success: false,

            message: "School not found",

        });

    }

    receiverEmail = school.email;

}

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "School Admin not found",

            });

        }

        // Remove previous OTP

        await Otp.deleteMany({

            phone,

        });

        // Generate OTP

        const otp = Math.floor(

            100000 + Math.random() * 900000

        ).toString();

        // Save OTP

        await Otp.create({

            phone,

            otp,

            expiresAt: new Date(

                Date.now() + 10 * 60 * 1000

            ),

        });


        await sendMail(

            receiverEmail,

            "School Bus Management - Password Reset OTP",

            `
                <h2>Password Reset Request</h2>

                <p>Hello ${user.name},</p>

                <p>Your OTP is:</p>

                <h1>${otp}</h1>

                <p>

                This OTP is valid for

                <b>10 minutes</b>.

                </p>

                <p>

                Ignore this email if you didn't request it.

                </p>
            `
        );

        res.json({

            success: true,

            message: "OTP sent successfully",

        });

        console.log(

    "Sending OTP to:",

    receiverEmail

);

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

exports.verifyOtp = async (req, res) => {

    try {

        const {

            phone,

            otp,

        } = req.body;

        const otpRecord = await Otp.findOne({

            phone,

            otp,

            verified: false,

        });

        if (!otpRecord) {

            return res.status(400).json({

                success: false,

                message: "Invalid OTP",

            });

        }

        if (otpRecord.expiresAt < new Date()) {

            return res.status(400).json({

                success: false,

                message: "OTP has expired",

            });

        }

        otpRecord.verified = true;

        await otpRecord.save();

        res.status(200).json({

            success: true,

            message: "OTP verified successfully",

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

exports.generateTemporaryPassword = async (req, res) => {

    try {

        const { phone } = req.body;

        const otpRecord = await Otp.findOne({

            phone,

            verified: true,

        });

        if (!otpRecord) {

            return res.status(400).json({

                success: false,

                message: "OTP verification required",

            });

        }

        if (otpRecord.expiresAt < new Date()) {

            return res.status(400).json({

                success: false,

                message: "OTP expired",

            });

        }

       const user = await User.findOne({

    phone,

    role: {

        $in: [

            "SUPER_ADMIN",

            "SCHOOL_ADMIN",

        ],

    },

});

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "School Admin not found",

            });

        }

        let receiverEmail;

let greetingName;

if (user.role === "SUPER_ADMIN") {

    receiverEmail = user.email;

    greetingName = user.name;

} else {

    const school = await School.findById(

        user.schoolId

    );

    if (!school) {

        return res.status(404).json({

            success:false,

            message:"School not found",

        });

    }

    receiverEmail = school.email;

    greetingName = school.schoolName;

}

        // Generate Temporary Password

        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

        let temporaryPassword = "SBM@";

        for (let i = 0; i < 6; i++) {

            temporaryPassword += chars.charAt(

                Math.floor(Math.random() * chars.length)

            );

        }

        // Hash Password

        const hashedPassword =
            await bcrypt.hash(

                temporaryPassword,

                10

            );

        // Update User

        user.password = hashedPassword;

        user.isFirstLogin = true;

        await user.save();

        // Delete OTP

        await Otp.deleteMany({

            phone,

        });

        // Send Temporary Password

        await sendMail(

            receiverEmail,

            "School Bus Management - Temporary Password",

            `
                <h2>Password Reset Successful</h2>

                <p>Hello ${greetingName},</p>

                <p>Your new temporary password is:</p>

                <h1>${temporaryPassword}</h1>

                <p>Please login using this password.</p>

                <p>You will be required to change it immediately after login.</p>
            `

        );

        res.status(200).json({

            success: true,

            message: "Temporary password sent to school's email.",

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

exports.testEmail = async (

    req,

    res

) => {

    try {

        await sendMail(

            req.body.email,

            "School Bus Management",

            `
            <h2>Email Working Successfully</h2>

            <p>

            Congratulations!

            Your School Bus Management System

            can now send emails.

            </p>
            `

        );

        res.json({

            success: true,

            message: "Email sent successfully",

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};