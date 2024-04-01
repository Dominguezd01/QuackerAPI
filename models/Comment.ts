import { PrismaClient, quacks, user_follows, users } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { User } from "./User"

const prisma = new PrismaClient()
export class Comment {
    static async create(userId: number, quackId: number, content: string) {
        try {
            let comment = await prisma.comments.create({
                data: {
                    content: content,
                    creation_date: new Date(),
                    is_active: true,
                    comment_id: uuidv4(),
                },
            })

            let commentQuack = await prisma.quack_comments.create({
                data: {
                    comment_id: comment.id,
                    quack_id: quackId,
                },
            })

            return true
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }
}
