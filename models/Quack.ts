import { PrismaClient, quacks, user_follows, users } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()
export class Quack {
    static async create(
        userId: string,
        content: string,
        isReply: boolean,
        isQuote: boolean,
        parentPost: number | null
    ): Promise<null | quacks | undefined> {
        try {
            if (content.length > 500) return undefined

            let user = await prisma.users.findFirst({
                where: {
                    user_name: userId,
                },
            })

            if (!user) return null

            let quack = await prisma.quacks.create({
                data: {
                    content: content,
                    is_quote: isQuote,
                    is_reply: isReply,
                    quack_id: uuidv4(),
                    is_active: true,
                    parent_post_id: parentPost,
                },
            })
            return quack
        } catch (ex) {
            console.log(ex)
        }
    }

    static async delete(quackId: number | undefined | null): Promise<boolean> {
        try {
            if (quackId == undefined || quackId == null) return false
            prisma.quacks.update({
                where: {
                    id: quackId,
                },
                data: {
                    is_active: false,
                },
            })
            return true
        } catch (ex) {
            console.log(ex)
            return false
        }
    }
}