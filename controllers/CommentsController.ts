import { Request, Response } from "express"
import { Quack } from "../models/Quack"
import { UserQuack } from "../models/UserQuack"
import { PrismaClient } from "@prisma/client"
import { User } from "../models/User"
import { Comment } from "../models/Comment"
const prisma = new PrismaClient()

export class CommentsController {
    static async create(req: Request, res: Response) {
        const userData = await req.body
        console.log(userData)
        if (
            !userData ||
            !userData.userId ||
            !userData.quackId ||
            !userData.content
        ) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check data provided" })
        }
        let user = await User.getUserById(userData.token.id)
        let quack = await Quack.getQuackByQuackId(userData.quackId)
        if (user === null)
            return res
                .status(404)
                .json({ status: 404, msg: "User provided does not exists" })

        if (user === undefined || quack === undefined)
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })

        if (quack === null)
            return res.status(404).json({ status: 404, msg: "Quack not found" })

        let comment = Comment.create(user.id, quack.id, userData.content)

        if (comment === undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })
        }

        return res.status(200).json({ status: 200, msg: "Comment created" })
    }
}
