import { PrismaClient, quacks, user_follows, users } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { User } from "./User"

const prisma = new PrismaClient()

export class Quack {
    static async create(
        userId: string,
        content: string,
        isReply: boolean,
        isQuote: boolean,
        parentPost: number | null
    ): Promise<null | quacks | undefined> {
        try {
            let user = await User.getUserByUserId(userId)
            if (!user) return null
            let quack = await prisma.quacks.create({
                data: {
                    content: content,
                    is_quote: isQuote,
                    is_reply: isReply,
                    quack_id: uuidv4(),
                    creation_date: new Date(),
                    is_active: true,
                    parent_post_id: parentPost,
                },
            })

            let userQuack = await prisma.user_quack.create({
                data: {
                    user_id: user.id,
                    post_id: quack.id,
                },
            })

            if (userQuack) return quack

            return undefined
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
            if (user == null) return false

            let daysInterval = new Date(
                new Date().setDate(new Date().getDate() - 30)
            )

            const quacks = await prisma.quacks.findMany({
                where: {
                    user_quack: {
                        some: {
                            users: {
                                user_follows_user_follows_user_id_followedTousers:
                                    {
                                        some: {
                                            user_id: user?.id,
                                        },
                                    },
                            },
                        },
                    },
                    creation_date: {
                        gte: daysInterval,
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
                    user_quack: {
                        select: {
                            users: {
                                select: {
                                    id: true,
                                    user_name: true,
                                    display_name: true,
                                    user_id: true,
                                },
                            },
                        },
                    },
                    user_quack_like: {
                        select: {
                            post_id: true,
                        },
                        where: {
                            user_id: user.id,
                        },
                    },

                    requacks: {
                        where: {
                            user_id: user.id,
                        },
                    },
                    _count: {
                        select: {
                            requacks: true,
                            quack_comments: true,
                            user_quack_like: true,
                        },
                    },
                },
            })

            return quacks
        } catch (error) {
            console.error("Error retrieving quacks:", error)
            return null
        }
    }

    static async getQuackInfo(quackId: string, userId: string) {
        try {
            let quack = await prisma.quacks.findFirst({
                where: {
                    quack_id: quackId,
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
                    user_quack: {
                        select: {
                            users: {
                                select: {
                                    id: true,
                                    user_name: true,
                                    display_name: true,
                                    user_id: true,
                                },
                            },
                        },
                    },
                    user_quack_like: {
                        select: {
                            post_id: true,
                        },
                        where: {
                            users: {
                                user_id: userId,
                            },
                        },
                    },
                    requacks: {
                        select: {
                            post_id: true,
                        },
                        where: {
                            users: {
                                user_id: userId,
                            },
                        },
                    },

                    _count: {
                        select: {
                            requacks: true,
                            //comments_comments_quack_id_commentedToquacks: true,
                            quack_comments: true,
                            user_quack_like: true,
                        },
                    },
                },
            })

            return quack
        } catch (ex) {
            console.log(ex)
            return undefined
        }
    }

    static async getQuackByQuackId(quackId: string) {
        try {
            let quack = await prisma.quacks.findFirst({
                where: {
                    quack_id: quackId,
                },
            })

            return quack
        } catch (ex) {
            console.log(ex)
            return undefined
        }
    }
}
