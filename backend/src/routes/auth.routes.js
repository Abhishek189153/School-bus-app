const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
    register,
    login,
    changePassword,
    testEmail,
    forgotPassword,
    verifyOtp,
    generateTemporaryPassword,
} = require("../controllers/auth.controller");


router.post("/register", register);

router.post("/login", login);

router.put(
    "/change-password",
    protect,
    changePassword
);

router.post(

"/test-email",

testEmail

);

router.post(

    "/forgot-password",

    forgotPassword

);

router.post(

    "/verify-otp",

    verifyOtp

);

router.post(

    "/generate-temp-password",
    generateTemporaryPassword

);




module.exports = router;