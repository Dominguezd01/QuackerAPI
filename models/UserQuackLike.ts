import {
    PrismaClient,
    quacks,
    user_follows,
    user_quack_like,
    users,
} from "@prisma/client"
const prisma = new PrismaClient({
    log: ["query", "info", "error"],
})
export class UserQuackLike {
    static async likeQuack(
        userId: number,
        quackId: number
    ): Promise<user_quack_like | undefined | boolean> {
        try {
            let quackLikedAlready = await this.findByUserIdAndQuackId(
                userId,
                quackId
            )
            if (quackLikedAlready == undefined) return undefined

            if (quackLikedAlready != null) {
                return false
            }

            let quackLike = await prisma.user_quack_like.create({
                data: {
                    post_id: quackId,
                    user_id: userId,
                },
            })
            console.log("QUACK LIKE")
            console.log(quackLike)
            return true
        } catch (ex) {
            console.log(ex)
            return undefined
        }
    }

    static async disLikeQuack(
        quackId: number
    ): Promise<user_quack_like | undefined> {
        try {
            let quackLike = await prisma.user_quack_like.delete({
                where: {
                    id: quackId,
                },
            })

            return quackLike
        } catch (ex) {
            console.log(ex)
            return undefined
        }
    }

    static async findByUserIdAndQuackId(
        userId: number,
        quackId: number
    ): Promise<user_quack_like | undefined | null> {
        try {
            let quackLike = await prisma.user_quack_like.findFirst({
                where: {
                    post_id: quackId,
                    user_id: userId,
                },
            })

            return quackLike
        } catch (ex) {
            console.log(ex)
            return undefined
        }
    }
}
