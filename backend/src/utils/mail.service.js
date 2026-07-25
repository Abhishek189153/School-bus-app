const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,

    },

      tls: {

        rejectUnauthorized: false,

    },

});

exports.sendMail = async (

    to,

    subject,

    html

) => {

    await transporter.sendMail({

        from: `"School Bus Management" <${process.env.EMAIL_USER}>`,

        to,

        subject,

        html,

    });

};