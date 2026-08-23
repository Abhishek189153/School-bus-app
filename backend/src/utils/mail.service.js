const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendMail = async (to, subject, html) => {
    try {
        console.log("Sending email to:", to);

        const { data, error } = await resend.emails.send({
            from: "School Bus Management <noreply@schoolbusmanagement.online>",
            to: [to],
            subject,
            html,
        });

        if (error) {
            console.error("RESEND EMAIL ERROR:", error);
            throw error;
        }

        console.log(
            "EMAIL SENT SUCCESSFULLY:",
            data?.id
        );

        return data;
    } catch (error) {
        console.error(
            "SEND MAIL ERROR:",
            error
        );

        throw error;
    }
};