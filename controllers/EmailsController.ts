import { users } from "@prisma/client"
import nodemailer from "nodemailer"
/**
 * Options to send the email in this case, by Gmail but you can customize to use the provider you want
 */
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_ACC,
        pass: process.env.GMAIL_TOKEN,
    },
})
/**
 * Handles the email stuff
 */
export class EmailsController {
    /**
     * Send the email to the user to verify his account
     * @param user to send the eamil
     * @param host to build the verify button route
     */
    static async sendEmailRegister(user: users, host: string | undefined) {
        const mailOptions = {
            from: process.env.GMAIL_ACC,
            to: user.email,
            subject: "Verify email",
            html: `
                Welcome to Ducker, before you can do anything, we need to verify this email exists.<br>
                Click on the link bellow to verify your account.<br>
                <a href="${process.env.PROTO}://${host}/users/auth/verifyRegister/${user.user_id}">VERIFY!!!</a>
            `,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error)
            } else {
                console.log("Email sent:", info.response)
            }
        })
    }
}
