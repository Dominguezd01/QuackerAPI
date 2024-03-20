import { PrismaClient, quacks, user_follows, users } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { User } from "./User"

const prisma = new PrismaClient()
export class Comment {
    static async create(
        userId: string,
        quackCommentedId: number,
        quackCommentId: number
    ) {}
}
