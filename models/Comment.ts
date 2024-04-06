import {
    comments,
    PrismaClient,
    quacks,
    user_follows,
    users,
} from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { User } from "./User"

const prisma = new PrismaClient()
export class Comment {
    static async create(userId: number, quackId: number, content: string) {
        try {
            let comment = await prisma.comments.create({
                data: {
                    content: content,
                    creation_date: new Date(),
                    is_active: true,
                    comment_id: uuidv4(),
                },
            })

            let commentQuack = await prisma.quack_comments.create({
                data: {
                    comment_id: comment.id,
                    quack_id: quackId,
                },
            })

            let comment_user = await prisma.user_comments.create({
                data: {
                    user_id: userId,
                    comment_id: comment.id,
                },
            })

            return true
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    static async getCommentByCommentId(commentId: string) {
        try {
            let comment = await prisma.comments.findFirst({
                select: {
                    id: true,
                    comment_id: true,

                    user_comments: {
                        select: {
                            id: true,
                            comment_id: true,
                            user_id: true,
                        },
                    },
                },
                where: {
                    comment_id: commentId,
                    is_active: true,
                },
            })
            return comment
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    static async delete(id: number) {
        try {
            return await prisma.comments.update({
                data: {
                    is_active: false,
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

    static async getCommentsFromQuack(id: number, userId: number) {
        try {
            let commentsList = []
            let commentsFound: any = await prisma.comments.findMany({
                select: {
                    comment_id: true,
                    content: true,
                    user_comments: {
                        select: {
                            users: {
                                select: {
                                    user_name: true,
                                    display_name: true,
                                    profile_picture: true,
                                },
                                where: {
                                    is_active: true,
                                },
                            },
                        },
                    },
                    comment_like: {
                        select: {
                            id: true,
                        },
                        where: {
                            user_id: userId,
                        },
                    },
                    comment_requack: {
                        select: {
                            id: true,
                        },
                        where: {
                            user_id: userId,
                        },
                    },

                    _count: {
                        select: {
                            comment_like: true,
                            comment_requack: true,
                            comments_comment_comments_comment_comment_idTocomments:
                                {
                                    where: {
                                        comments_comments_comment_comment_commented_idTocomments:
                                            {
                                                is_active: true,
                                            },
                                    },
                                },
                        },
                    },
                },
                where: {
                    is_active: true,
                    quack_comments: {
                        some: {
                            quack_id: id,
                        },
                    },
                },
            })
            for (let comment of commentsFound) {
                comment.comment_like = comment.comment_like.length !== 0
                comment.comment_requack = comment.comment_requack.length !== 0
            }
            return commentsFound
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }
}
