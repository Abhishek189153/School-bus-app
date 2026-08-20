const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendOTPEmail = async (
    email,
    otp
) => {

    try {

        await transporter.sendMail({

            from:
                `"School Bus Management" <${process.env.EMAIL_USER}>`,

            to:
                email,

            subject:
                "Password Reset OTP - School Bus Management",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 500px;
                    margin: auto;
                    padding: 25px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                ">

                    <h2 style="
                        color: #0F172A;
                        margin-bottom: 10px;
                    ">
                        Password Reset
                    </h2>

                    <p style="
                        color: #475569;
                        font-size: 15px;
                    ">
                        We received a request to reset your
                        School Bus Management account password.
                    </p>

                    <p style="
                        color: #475569;
                        font-size: 15px;
                    ">
                        Your One-Time Password (OTP) is:
                    </p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        color: #2563EB;
                        background: #EFF6FF;
                        padding: 15px;
                        text-align: center;
                        border-radius: 10px;
                        margin: 20px 0;
                    ">
                        ${otp}
                    </div>

                    <p style="
                        color: #64748B;
                        font-size: 14px;
                    ">
                        This OTP is valid for <strong>5 minutes</strong>.
                    </p>

                    <p style="
                        color: #64748B;
                        font-size: 14px;
                    ">
                        If you did not request a password reset,
                        please ignore this email.
                    </p>

                    <hr style="
                        border: none;
                        border-top: 1px solid #e2e8f0;
                        margin: 25px 0;
                    ">

                    <p style="
                        color: #94A3B8;
                        font-size: 12px;
                        text-align: center;
                    ">
                        Student's Safety, Our Priority
                    </p>

                </div>
            `,

        });

        console.log(
            "OTP EMAIL SENT:",
            email
        );

        return true;

    } catch (error) {

        console.log(
            "SEND OTP EMAIL ERROR:",
            error
        );

        return false;

    }

};