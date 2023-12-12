import { PrismaClient, user_follows, users } from "@prisma/client"
import { checkPass, encodePass } from "../lib/passwordFunctions"

import { v4 as uuidv4 } from "uuid"
import { EmailsController } from "../controllers/EmailsController"
const prisma = new PrismaClient()
export class User {
    /**
     * Creates a user with the data provided
     * @param reqBody
     * @param host
     * @returns
     */
    static async createUser(
        reqBody: any,
        host: string | undefined
    ): Promise<boolean | undefined | null> {
        let { display_name, emailUser, password, user_name_user } = reqBody

        try {
            let user = await prisma.users.findFirst({
                where: {
                    OR: [
                        {
                            user_name: {
                                equals: user_name_user,
                            },
                            email: {
                                equals: emailUser,
                            },
                        },
                    ],
                },
            })
            console.log(user)
            if (user != null) return null
            user = await prisma.users.create({
                data: {
                    display_name: display_name,
                    email: emailUser,
                    password: await encodePass(password),
                    email_is_valid: false,
                    is_active: false,
                    user_id: uuidv4(),
                    user_name: user_name_user,
                },
            })

            EmailsController.sendEmailRegister(user, host)
            return true
        } catch (ex) {
            console.log(ex)
            return false
        }
    }
    /**
     * Get the user info by the userName and check if the password is correct
     * @param userName
     * @param password
     * @returns
     */
    static async getUserByUserName(
        userName: string,
        password: string
    ): Promise<users | null | undefined> {
        try {
            let user = await prisma.users.findFirst({
                where: {
                    user_name: userName,
                    is_active: true,
                    email_is_valid: true,
                },
            })
            console.log(user)
            encodePass(password)
            if (user == null) return null
            if (await checkPass(password, user.password)) {
                return user
            }

            return null
        } catch (ex) {
            console.log("Error in login")
            console.log(ex)
            return undefined
        }
    }
    /**
     * Gets the user by the email and checks the password
     * @param email
     * @param password
     * @returns null if there is no user, undefined if something crash and the user itself if found
     */
    static async getUserByUserEmail(
        email: string,
        password: string
    ): Promise<users | null | undefined> {
        try {
            let user = await prisma.users.findFirst({
                where: {
                    email: email,
                    password: await encodePass(password),
                    is_active: true,
                    email_is_valid: true,
                },
            })

            if ((user = null)) return null
            return user
        } catch (ex) {
            console.log("Error in login")
            console.log(ex)
            return undefined
        }
    }

    /**
     * Look for a user with the "user_id" field provided
     * @param userId
     */
    static async getUserByUserId(
        userId: string
    ): Promise<users | null | undefined> {
        try {
            let user = await prisma.users.findFirst({
                where: {
                    user_id: userId,
                    is_active: false,
                    email_is_valid: false,
                },
            })
            if (user == null) return null

            return user
        } catch (e) {
            console.log(e)
        }
    }
    /**
     * Activates the user sent by parameter
     * @param user to activate
     */
    static async activateUser(user: users): Promise<Boolean> {
        try {
            await prisma.users.update({
                where: {
                    id: user.id,
                },
                data: {
                    is_active: true,
                    email_is_valid: true,
                },
            })
            return true
        } catch (ex) {
            console.log(ex)
            return false
        }
    }
}
