const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

exports.sendOTPEmail = async (
  email,
  otp
) => {
  try {
    console.log(
      "SENDING OTP EMAIL TO:",
      email
    );

    const { data, error } =
      await resend.emails.send({
        from:
          "School Bus Management <noreply@schoolbusmanagement.online>",
        to: [email],
        subject:
          "School Bus Management - Password Reset OTP",
        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: auto;
            padding: 20px;
          ">
            <h2 style="color:#0F172A;">
              Password Reset
            </h2>

            <p>
              You requested to reset your
              School Bus Management password.
            </p>

            <p>
              Your OTP is:
            </p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #2563EB;
              margin: 20px 0;
            ">
              ${otp}
            </div>

            <p>
              This OTP is valid for
              <strong>5 minutes</strong>.
            </p>

            <p>
              If you did not request a password reset,
              please ignore this email.
            </p>

            <hr />

            <p style="
              color:#64748B;
              font-size:12px;
            ">
              Student's Safety, Our Priority
            </p>
          </div>
        `,
      });

    if (error) {
      console.log(
        "RESEND EMAIL ERROR:",
        error
      );
      return false;
    }

    console.log(
      "OTP EMAIL SENT:",
      data?.id
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