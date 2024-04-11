import {
    comment_like,
    comment_requack,
    PrismaClient,
    quacks,
    user_follows,
    user_quack_like,
    users,
} from "@prisma/client"
const prisma = new PrismaClient({
    log: ["query", "info", "error"],
})
export class CommentRequack {
    static async create(userId: number, commentId: number) {
        try {
            let commentRequack = await prisma.comment_requack.create({
                data: {
                    comment_id: commentId,
                    user_id: userId,
                },
            })
            return true
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    static async delete(requackCommentId: number) {
        try {
            let commentRequack = await prisma.comment_requack.delete({
                where: {
                    id: requackCommentId,
                },
            })
            return true
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    static async getRequackId(
        userId: number,
        commentId: number
    ): Promise<comment_requack | null | undefined> {
        try {
            let requack = await prisma.comment_requack.findFirst({
                where: {
                    user_id: userId,
                    comment_id: commentId,
                },
            })

            return requack
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }
}
