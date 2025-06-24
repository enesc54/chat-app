import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD }
});

export const sendMail = async (
    mailTitle: string,
    mailContent: string,
    receiver: string
) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: receiver,
        subject: mailTitle,
        html: mailContent
    });
};
