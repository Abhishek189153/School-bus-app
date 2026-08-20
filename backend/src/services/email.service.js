const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendOTPEmail = async (email, otp) => {

    try {

        console.log("EMAIL USER:", process.env.EMAIL_USER);
        console.log(
            "EMAIL PASSWORD EXISTS:",
            !!process.env.EMAIL_PASS
        );

        await transporter.verify();

        console.log(
            "GMAIL SMTP CONNECTION SUCCESS"
        );

        const info =
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
                    ">

                        <h2 style="color:#0F172A;">
                            Password Reset
                        </h2>

                        <p>
                            Your password reset OTP is:
                        </p>

                        <div style="
                            font-size:32px;
                            font-weight:bold;
                            letter-spacing:8px;
                            color:#2563EB;
                            background:#EFF6FF;
                            padding:15px;
                            text-align:center;
                            border-radius:10px;
                            margin:20px 0;
                        ">
                            ${otp}
                        </div>

                        <p>
                            This OTP is valid for
                            <strong>5 minutes</strong>.
                        </p>

                        <p>
                            If you did not request a password
                            reset, please ignore this email.
                        </p>

                        <hr />

                        <p style="
                            color:#94A3B8;
                            text-align:center;
                            font-size:12px;
                        ">
                            Student's Safety, Our Priority
                        </p>

                    </div>
                `,
            });

        console.log(
            "OTP EMAIL SENT:",
            info.messageId
        );

        return true;

    } catch (error) {

        console.log(
            "SEND OTP EMAIL ERROR:"
        );

        console.log(
            "CODE:",
            error.code
        );

        console.log(
            "MESSAGE:",
            error.message
        );

        console.log(
            "RESPONSE:",
            error.response
        );

        return false;

    }
};