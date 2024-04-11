import { PrismaClient, user_follows, users } from "@prisma/client"
import { checkPass, encodePass } from "../lib/passwordFunctions"

import { v4 as uuidv4 } from "uuid"
import { EmailsController } from "../controllers/EmailsController"
import { assign } from "nodemailer/lib/shared"
const prisma = new PrismaClient({
    log: ["query"],
})
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
        let {
            display_name,
            emailUser,
            password,
            user_name_user,
            profilePicture,
        } = reqBody

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
                    profile_picture: profilePicture,
                },
            })

            EmailsController.sendEmailRegister(user, host)
            return true
        } catch (ex) {
            console.error(ex)
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
            if (
                user === null ||
                (await checkPass(password, user?.password)) === false
            )
                return null

            return user
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }
    /**
     * Gets the user by the email and checks the password
     * @param email
     * @param password
     * @returns null if there is no user, undefined if something crash and the user itself if found
     */
    static async getUserByUserEmail(email: string, password: string) {
        try {
            let user = await prisma.users.findFirst({
                where: {
                    user_name: email,
                    is_active: true,
                    email_is_valid: true,
                },
            })

            if (
                user === null ||
                (await checkPass(password, user?.password)) === false
            )
                return null

            return user
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    /**
     * Looks for a user with the "user_id" field provided
     * @param userId
     */
    static async getUserByUserId(
        userId: string,
        is_active: boolean = true,
        email_is_valid: boolean = true
    ) {
        try {
            let user = await prisma.users.findFirst({
                select: {
                    id: true,
                    user_name: true,
                },
                where: {
                    user_id: userId,
                    is_active: is_active,
                    email_is_valid: email_is_valid,
                },
            })
            if (user == null) return null

            return user
        } catch (ex) {
            return undefined
        }
    }

    /**
     * Look for a user with the "user_id" field provided
     * @param userId
     */
    static async getUserDisabledByUserName(
        userName: string
    ): Promise<users | null | undefined> {
        try {
            let user = await prisma.users.findFirst({
                where: {
                    user_name: userName,
                    is_active: false,
                    email_is_valid: false,
                },
            })
            if (user == null) return null

            return user
        } catch (ex) {
            console.error(ex)
            return undefined
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
            console.error(ex)
            return false
        }
    }
    /**
     * Gets the user by the name of the user
     * @param userName name of the user
     * @returns complete user object
     */
    static async getUserInfoByUserName(
        userName: string
    ): Promise<users | null | undefined> {
        try {
            let user = await prisma.users.findFirst({
                where: {
                    user_name: userName,
                },
            })

            return user
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }
    /**
     * This function is used to get the info to load the profiles
     * @param userId user who is looking for the info
     * @param userProfileCheck the user id to load
     * @returns the user info
     */
    static async getUserProfile(userId: number, userProfileCheck: string) {
        try {
            let user = await prisma.users.findFirst({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                },
            })

            let userCheck: any = await prisma.users.findFirst({
                where: {
                    user_name: userProfileCheck,
                    is_active: true,
                },
                select: {
                    id: true,
                    password: false,
                    user_id: false,
                    user_name: true,
                    display_name: true,
                    profile_picture: true,
                    bio: true,
                    user_quack: {
                        select: {
                            quacks: {
                                select: {
                                    quack_id: true,
                                    content: true,

                                    _count: {
                                        select: {
                                            requacks: true,
                                            user_quack_like: true,
                                            quack_comments: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            //user followed count of users
                            user_follows_user_follows_user_idTousers: true,
                            //number of followers the user has
                            user_follows_user_follows_user_id_followedTousers:
                                true,
                        },
                    },
                },
            })

            let followed = await prisma.user_follows.findFirst({
                where: {
                    user_id: user?.id,
                    user_id_followed: userCheck?.id,
                },
            })

            let isUser: boolean = userCheck.id == user?.id
            delete userCheck.id
            return {
                user: userCheck,
                followed: followed == null ? false : true,
                isUser: isUser,
            }
        } catch (ex) {
            console.error(ex)
            return null
        }
    }
    /**
     * Gets the user by parameter
     * @param id user id
     * @returns user
     */
    static async getUserById(id: number) {
        try {
            return await prisma.users.findUnique({
                select: {
                    id: true,
                    user_id: true,
                    display_name: true,
                    user_name: true,
                    email: true,
                    bio: true,
                    password: false,
                    is_active: true,
                },
                where: {
                    id: id,
                },
            })
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }
}
