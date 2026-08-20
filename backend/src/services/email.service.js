const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_APP_PASSWORD,
    },
  });


const sendOTPEmail =
  async (email, otp) => {

    try {

      await transporter.sendMail({

        from:
          `"School Bus Management" <${process.env.EMAIL_USER}>`,

        to:
          email,

        subject:
          "Password Reset OTP",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
          ">

            <h2 style="
              color: #0F172A;
            ">
              Password Reset
            </h2>

            <p>
              We received a request to reset your
              School Bus Management password.
            </p>

            <p>
              Your verification OTP is:
            </p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #2563EB;
              margin: 25px 0;
            ">
              ${otp}
            </div>

            <p>
              This OTP will expire in
              <strong>5 minutes</strong>.
            </p>

            <p style="
              color: #64748B;
            ">
              If you did not request a password reset,
              please ignore this email.
            </p>

            <p style="
              color: #94A3B8;
              font-size: 12px;
              margin-top: 30px;
            ">
              School Bus Management System
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
        "OTP EMAIL ERROR:",
        error
      );

      return false;

    }

  };


module.exports = {
  sendOTPEmail,
};