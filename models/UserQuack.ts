import { PrismaClient, user_follows, users } from "@prisma/client"
const prisma = new PrismaClient()

export class UserQuack {
    static async create(userId: number, quackId: number): Promise<boolean> {
        try {
            let userQuack = await prisma.user_quak.create({
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
