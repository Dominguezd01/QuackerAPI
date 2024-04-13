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
        if (!userData || !userData.quackId || !userData.content) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check data provided" })
        }

        if (userData.content.length > 135) {
            return res
                .status(413)
                .json({ status: 413, msg: "Content too long" })
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

        let comment = await Comment.create(user.id, quack.id, userData.content)

        if (comment == undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })
        }

        return res.status(201).json({ status: 201, comment: comment })
    }

    static async delete(req: Request, res: Response) {
        const userData = await req.body

        if (!userData || !userData.commentId) {
            return res.status(400).json({
                status: 400,
                msg: "Comment id missing",
            })
        }

        let user = await User.getUserById(userData.token.id)

        let comment: any = await Comment.getCommentByCommentId(
            userData.commentId
        )

        if (user === null) {
            return res.status(401).json({ status: 401, msg: "Unauthorized" })
        }

        if (comment === null) {
            return res
                .status(404)
                .json({ status: 404, msg: "Comment not found" })
        }

        if (user === undefined || comment === undefined) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal server error" })
        }

        if (comment.user_comments.user_id !== user.id) {
            return res.status(403).json({
                status: 403,
                msg: "Forbidden",
            })
        }

        if ((await Comment.delete(comment.id)) === undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Internal server error",
            })
        }

        return res.status(200)
    }

    static async getCommentsFromQuack(req: Request, res: Response) {
        const { quackId } = req.params
        if (!quackId) {
            return res
                .status(400)
                .json({ status: 400, msg: "Quack id is missing" })
        }

        let quack = await Quack.getQuackByQuackId(quackId)
        let user = await User.getUserById(await req.body.token.id)

        if (quack === null || quack?.is_active === false) {
            return res.status(404).json({ status: 404, msg: "Quack not found" })
        }
        if (user === null || user?.is_active === false) {
            return res.status(401).json({ status: 401 })
        }

        if (quack === undefined || user === undefined) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal server error" })
        }

        let comments = await Comment.getCommentsFromQuack(quack.id, user.id)

        return res.status(200).json({ status: 200, comments: comments })
    }
}
