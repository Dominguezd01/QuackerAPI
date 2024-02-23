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
    ): Promise<Boolean | null> {
        try {
            let relation = await prisma.user_follows.create({
                data: {
                    user_id_following: userId,
                    user_id_followed: userFollowed,
                },
            })

            if (relation) return true

            return false
        } catch (ex) {
            console.log(ex)
            return null
        }
    }
}
