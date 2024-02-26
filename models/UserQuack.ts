import { PrismaClient, user_follows, users } from "@prisma/client"
const prisma = new PrismaClient()

export class UserQuack {
    static async create(userId: number, quackId: number): Promise<boolean> {
        try {
            console.log(userId)
            console.log(quackId)
            let userQuack = await prisma.user_quack.create({
                data: {
                    user_id: userId,
                    post_id: quackId,
                },
            })

            return true
        } catch (ex) {
            console.log(ex)
            return false
        }
    }
}
