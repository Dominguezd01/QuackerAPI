import {
    PrismaClient,
    quacks,
    user_follows,
    user_quack_like,
    users,
} from "@prisma/client"
const prisma = new PrismaClient()
export class UserQuackLike {
    /**
     * Create the relation between the user id and the quack id
     * @param userId user that likes the post
     * @param quackId the post
     * @returns true or undefined if something is wrong
     */
    static async likeQuack(
        userId: number,
        quackId: number
    ): Promise<user_quack_like | undefined | boolean> {
        try {
            let quackLikedAlready = await this.findByUserIdAndQuackId(
                userId,
                quackId
            )
            if (quackLikedAlready === undefined) return undefined

            if (quackLikedAlready != null) {
                return false
            }

            let quackLike = await prisma.user_quack_like.create({
                data: {
                    post_id: quackId,
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
     * @param quackId the row id to delete
     * @returns true | undefined
     */
    static async disLikeQuack(quackId: number): Promise<boolean | undefined> {
        try {
            let quackLike = await prisma.user_quack_like.delete({
                where: {
                    id: quackId,
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
     * @param quackId quack id
     * @returns true | undefined
     */
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
            console.error(ex)
            return undefined
        }
    }
}
