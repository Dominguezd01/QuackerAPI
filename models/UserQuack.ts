import { PrismaClient, user_follows, users } from "@prisma/client"
const prisma = new PrismaClient()

export class UserQuack {
    static async create(userId: number, quackId: number): Promise<boolean> {
        try {
            let userQuack = await prisma.user_quack.create({
                data: {
                    user_id: userId,
                    post_id: quackId,
                },
            })

            return true
        } catch (ex) {
            console.error(ex)
            return false
        }
    }

    static async isUserQuack(
        userId: number,
        quackId: number
    ): Promise<boolean | undefined> {
        try {
            return (
                (await prisma.user_quack.findFirst({
                    where: { user_id: userId, post_id: quackId },
                })) !== null
            )
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }
}
