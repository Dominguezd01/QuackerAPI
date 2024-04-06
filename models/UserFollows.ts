import { PrismaClient, quacks, user_follows, users } from "@prisma/client"

const prisma = new PrismaClient()
export class UserFollows {
    /**
     * Follows a user sent by param
     * @param userId the id of the user who sent the request to follow
     * @param userFollowed the user followed
     * @returns true if correct false if not and null if there is an error
     */
    static async follow(
        userId: number,
        userFollowed: number
    ): Promise<Boolean | user_follows | undefined> {
        try {
            let relation = await prisma.user_follows.create({
                data: {
                    user_id: userId,
                    user_id_followed: userFollowed,
                },
            })

            return relation
        } catch (ex) {
            console.log(ex)
            return undefined
        }
    }

    static async unFollow(
        followedId: number
    ): Promise<Boolean | user_follows | undefined> {
        try {
            let relation = await prisma.user_follows.delete({
                where: {
                    id: followedId,
                },
            })

            return relation
        } catch (ex) {
            console.log(ex)
            return undefined
        }
    }
    /**
     * Check wether the user follows the one who is trying to follow
     * @param userId
     * @param userIdFollowed
     * @returns true | false depending on the state and null if theres an exception
     */
    static async checkIfFollow(
        userId: number,
        userIdFollowed: number
    ): Promise<user_follows | null | undefined> {
        try {
            let exists = await prisma.user_follows.findFirst({
                where: {
                    user_id: userId,
                    user_id_followed: userIdFollowed,
                },
            })

            return exists
        } catch (ex) {
            console.log(ex)
            return undefined
        }
    }
}
