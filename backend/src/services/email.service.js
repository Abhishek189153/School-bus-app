const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

const sendPasswordResetOTP =
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
            max-width: 500px;
            margin: auto;
            padding: 25px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
          ">

            <h2>
              Password Reset
            </h2>

            <p>
              You requested to reset your
              School Bus Management password.
            </p>

            <p>
              Your verification OTP is:
            </p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 20px 0;
            ">
              ${otp}
            </div>

            <p>
              This OTP is valid for
              <strong>5 minutes</strong>.
            </p>

            <p>
              If you did not request this,
              you can safely ignore this email.
            </p>

          </div>
        `,

      });

      console.log(
        "PASSWORD RESET OTP SENT:",
        email
      );

      return true;

    } catch (error) {

      console.log(
        "SEND PASSWORD RESET EMAIL ERROR:",
        error
      );

      return false;

    }

  };

module.exports = {
  sendPasswordResetOTP,
};