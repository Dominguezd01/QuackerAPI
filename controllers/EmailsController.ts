import { users } from "@prisma/client";
import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_ACC,
        pass: process.env.GMAIL_TOKEN,
    },
});

export class EmailsController {
    static async sendEmailRegister(user: users, host: string | undefined) {
        const mailOptions = {
            from: process.env.GMAIL_ACC,
            to: user.email,
            subject: 'Verify email',
            html:
                `
                Welcome to Ducker, before you can do anything, we need to verify this email exists.<br>
                Click on the link bellow to verify your account.<br>
                <a href="${process.env.PROTO}://${host}/users/auth/verifyRegister/${user.user_id}">VERIFY!!!</a>
            `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    }
}