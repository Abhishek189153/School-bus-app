const dns = require("dns");
const nodemailer = require("nodemailer");

// IMPORTANT:
// Force Node.js to prefer IPv4 over IPv6.
// Render is currently unable to reach Gmail's IPv6 SMTP address.
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    requireTLS: true,

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
});

exports.sendMail = async (
    to,
    subject,
    html
) => {

    try {

        console.log(
            "Sending email to:",
            to
        );

        const info =
            await transporter.sendMail({
                from:
                    `"School Bus Management" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html,
            });

        console.log(
            "EMAIL SENT SUCCESSFULLY:",
            info.messageId
        );

        return info;

    } catch (error) {

        console.error(
            "SEND MAIL ERROR:",
            error
        );

        throw error;
    }
};