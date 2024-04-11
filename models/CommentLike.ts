import {
    comment_like,
    PrismaClient,
    quacks,
    user_follows,
    user_quack_like,
    users,
} from "@prisma/client"
const prisma = new PrismaClient()
export class CommentLike {
    /**
     * Create the relation between the user id and the quack id
     * @param userId user that likes the post
     * @param quackId the post
     * @returns true or undefined if something is wrong
     */
    static async likeComment(
        userId: number,
        quackId: number
    ): Promise<user_quack_like | undefined | boolean> {
        try {
            let commentAlreadyLiked = await this.findByUserIdAndCommentId(
                userId,
                quackId
            )
            if (commentAlreadyLiked === undefined) return undefined

            if (commentAlreadyLiked != null) {
                return false
            }

            let quackLike = await prisma.comment_like.create({
                data: {
                    comment_id: quackId,
                    user_id: userId,
                },
            })
            return true
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }
    /**
     * Destroy the row with the id provided
     * @param commentId the row id to delete
     * @returns true | undefined
     */
    static async disLikeQuack(commentId: number): Promise<boolean | undefined> {
        try {
            let commentLike = await prisma.comment_like.delete({
                where: {
                    id: commentId,
                },
            })

            return true
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    /**
     * Finds the quack liked and delete it
     * @param userId user id
     * @param commentId quack id
     * @returns true | undefined
     */
    static async findByUserIdAndCommentId(
        userId: number,
        commentId: number
    ): Promise<comment_like | undefined | null> {
        try {
            let commentLike = await prisma.comment_like.findFirst({
                where: {
                    comment_id: commentId,
                    user_id: userId,
                },
            })
            return commentLike
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }
}
