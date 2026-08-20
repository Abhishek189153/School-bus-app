const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    family: 4,

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
            "EMAIL SENT:",
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