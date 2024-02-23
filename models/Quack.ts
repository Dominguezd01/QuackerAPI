import { PrismaClient, quacks, user_follows, users } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { User } from "./User"

const prisma = new PrismaClient()
interface QuackWithCounts {
    id: number
    content: string
    creation_date: Date
    parent_post_id: number | null
    is_quote: boolean
    is_reply: boolean
    is_active: boolean
    user: {
        user_id: string
        display_name: string
        user_name: string
    }
    user_quack_like_count?: number
    requacks_count?: number
}
export class Quack {
    static async create(
        userId: string,
        content: string,
        isReply: boolean,
        isQuote: boolean,
        parentPost: number | null
    ): Promise<null | quacks | undefined> {
        try {
            let user = User.getUserByUserId(userId)

            console.log("USER")
            console.log(user)
            if (!user) return null
            return await prisma.quacks.create({
                data: {
                    content: content,
                    is_quote: isQuote,
                    is_reply: isReply,
                    quack_id: uuidv4(),
                    is_active: true,
                    parent_post_id: parentPost,
                },
            })
        } catch (ex) {
            console.log(ex)
            return undefined
        }
    }

    static async delete(quackId: number | undefined | null): Promise<boolean> {
        try {
            if (quackId == undefined || quackId == null) return false
            prisma.quacks.update({
                where: {
                    id: quackId,
                },
                data: {
                    is_active: false,
                },
            })
            return true
        } catch (ex) {
            console.log(ex)
            return false
        }
    }

    static async mainPage(userId: string) {
        try {
            const user = await prisma.users.findFirst({
                where: {
                    user_id: userId,
                },
            })
            console.log(userId)
            if (user == null) return false
            const tenDaysAgo = new Date()
            tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
            const quacks = await prisma.quacks.findMany({
                where: {
                    user_quak: {
                        some: {
                            users: {
                                user_follows_user_follows_user_id_followingTousers:
                                    {
                                        some: {
                                            user_id_followed: user?.id, // User ID of the user you are following
                                        },
                                    },
                            },
                        },
                    },
                },
                select: {
                    id: true,
                    quack_id: true,
                    content: true,
                    creation_date: true,
                    parent_post_id: true,
                    is_quote: true,
                    is_reply: true,
                    is_active: true,
                    user_quak: {
                        select: {
                            users: {
                                select: {
                                    user_name: true,
                                    display_name: true,
                                    user_id: true,
                                },
                            },
                        },
                    },
                    requacks: {
                        select: {
                            id: true,
                        },
                    },
                    user_quack_like: {
                        select: {
                            id: true,
                        },
                    },
                },
            })

            let quacksSend: any = []
            for (let quack of quacks) {
                let quackSend = {
                    id: quack.quack_id,
                    authorDisplayName: quack.user_quak[0].users.display_name,
                    authorUserName: quack.user_quak[0].users.user_name,
                    authorUserId: quack.user_quak[0].users.user_id,
                    likeCount: quack.user_quack_like.length,
                    requackCount: quack.requacks.length,
                    content: quack.content,
                    commentCount: await prisma.quacks.count({
                        where: { parent_post_id: quack.id },
                    }),
                }
                quacksSend.push(quackSend)
            }

            return quacksSend
        } catch (error) {
            console.error("Error retrieving quacks:", error)
            throw error
        }
    }
}
