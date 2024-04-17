import { PrismaClient, quacks, user_follows, users } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { User } from "./User"

const prisma = new PrismaClient()

export class Quack {
    static async create(
        userId: number,
        content: string,
        isReply: boolean,
        isQuote: boolean,
        parentPost: number | null
    ): Promise<null | quacks | undefined> {
        try {
            let user = await User.getUserById(userId)
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
            return quack
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    static async delete(
        quackId: number | undefined | null
    ): Promise<boolean | undefined> {
        try {
            if (quackId == undefined || quackId == null) return false
            await prisma.quacks.update({
                where: {
                    id: quackId,
                },
                data: {
                    is_active: false,
                },
            })
            return true
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    static async mainPage(userId: number) {
        try {
            const user = await prisma.users.findFirst({
                where: {
                    id: userId,
                },
            })
            if (user === null) return false

            let daysInterval = new Date(
                new Date().setDate(new Date().getDate() - 30)
            )
            const quacks: any = await prisma.quacks.findMany({
                where: {
                    user_quack: {
                        some: {
                            users: {
                                user_follows_user_follows_user_id_followedTousers:
                                    {
                                        some: {
                                            user_id: user.id,
                                        },
                                    },
                            },
                        },
                    },
                    is_active: true,
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
                                    profile_picture: true,
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
                        select: {
                            post_id: true,
                        },
                        where: {
                            user_id: user.id,
                        },
                    },
                    _count: {
                        select: {
                            requacks: true,
                            quack_comments: {
                                where: {
                                    comments: {
                                        is_active: true,
                                    },
                                },
                            },
                            user_quack_like: true,
                        },
                    },
                },
            })

            for (let quack of quacks) {
                quack.isFromUser = quack.user_quack[0].id === user.id
                delete quack.user_quack[0].id
                delete quack.id
            }
            return quacks
        } catch (error) {
            console.error("Error retrieving quacks:", error)
            return null
        }
    }

    static async getQuackInfo(quackId: string, userId: number) {
        try {
            let quack: any = await prisma.quacks.findFirst({
                where: {
                    quack_id: quackId,
                    is_active: true,
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
                                    profile_picture: true,
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
                                id: userId,
                            },
                        },
                    },
                    requacks: {
                        select: {
                            post_id: true,
                        },
                        where: {
                            users: {
                                id: userId,
                            },
                        },
                    },

                    _count: {
                        select: {
                            requacks: true,
                            //comments_comments_quack_id_commentedToquacks: true,
                            quack_comments: {
                                where: {
                                    comments: {
                                        is_active: true,
                                    },
                                },
                            },
                            user_quack_like: true,
                        },
                    },
                },
            })

            if (quack !== null) {
                quack.isFromUser = quack?.user_quack[0].users.id === userId
            }

            return quack
        } catch (ex) {
            console.error(ex)
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
            console.error(ex)
            return undefined
        }
    }

    static async getQuackByQuackIdIsActive(quackId: string) {
        try {
            let quack = await prisma.quacks.findFirst({
                where: {
                    quack_id: quackId,
                    is_active: true,
                },
            })

            return quack
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    static async getQuackAndInfoById(quackId: number, userId: number) {
        try {
            let quack = await prisma.quacks.findFirst({
                where: {
                    id: quackId,
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
                                    user_name: true,
                                    display_name: true,
                                    profile_picture: true,
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
                                id: userId,
                            },
                        },
                    },
                    requacks: {
                        select: {
                            post_id: true,
                        },
                        where: {
                            users: {
                                id: userId,
                            },
                        },
                    },

                    _count: {
                        select: {
                            requacks: true,
                            //comments_comments_quack_id_commentedToquacks: true,
                            quack_comments: {
                                where: {
                                    comments: {
                                        is_active: true,
                                    },
                                },
                            },
                            user_quack_like: true,
                        },
                    },
                },
            })

            return quack
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    static async getUserCheckedQuacks(userId: number, userIdCheked: number) {
        try {
            let quacks: any = await prisma.quacks.findMany({
                where: {
                    is_active: true,

                    user_quack: {
                        some: {
                            user_id: userIdCheked,
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
                    user_quack: {
                        select: {
                            users: {
                                select: {
                                    id: true,
                                    user_name: true,
                                    display_name: true,
                                    profile_picture: true,
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
                                id: userId,
                            },
                        },
                    },
                    requacks: {
                        select: {
                            post_id: true,
                        },
                        where: {
                            users: {
                                id: userId,
                            },
                        },
                    },

                    _count: {
                        select: {
                            requacks: true,
                            //comments_comments_quack_id_commentedToquacks: true,
                            quack_comments: {
                                where: {
                                    comments: {
                                        is_active: true,
                                    },
                                },
                            },
                            user_quack_like: true,
                        },
                    },
                },
            })

            for (let quack of quacks) {
                quack.isFromUser = quack.user_quack[0].users.id === userId

                delete quack.user_quack[0].users.id
            }
            return quacks
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    static async edit(quackId: number, newContent: string) {
        try {
            let quack = await prisma.quacks.update({
                data: {
                    content: newContent,
                },
                where: {
                    id: quackId,
                },
            })

            return quack
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }
}
