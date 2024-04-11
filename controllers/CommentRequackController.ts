import { Request, Response } from "express"
import { Comment } from "../models/Comment"
import { User } from "../models/User"
import { CommentLike } from "../models/CommentLike"
import { CommentRequack } from "../models/CommentRequack"
export class CommentRequackController {
    static async create(req: Request, res: Response): Promise<Response> {
        let userData = await req.body

        if (!userData || !userData.commentId) {
            return res
                .status(400)
                .json({ status: 400, msg: "Some content missing" })
        }

        let user = await User.getUserById(userData.token.id)
        let comment = await Comment.getCommentByCommentIdNoUserInfo(
            userData.commentId
        )

        if (user === null) return res.status(401).json({ status: 401 })

        if (user === undefined)
            return res.status(500).json({ status: 500, msg: "Internal error" })

        if (comment === null)
            return res
                .status(404)
                .json({ status: 404, msg: "Comment not found" })

        if (comment === undefined)
            return res
                .status(500)
                .json({ status: 500, msg: "Internal server error" })

        let commentRequack = await CommentRequack.create(user.id, comment.id)

        if (commentRequack === undefined)
            return res
                .status(500)
                .json({ status: 500, msg: "Internal server error" })

        return res.status(200).json({ status: 200 })
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        let userData = await req.body

        if (!userData || !userData.commentId) {
            return res
                .status(400)
                .json({ status: 400, msg: "Some content missing" })
        }

        let user = await User.getUserById(userData.token.id)
        let comment = await Comment.getCommentByCommentIdNoUserInfo(
            userData.commentId
        )

        if (user === null) return res.status(401).json({ status: 401 })

        if (user === undefined)
            return res.status(500).json({ status: 500, msg: "Internal error" })

        if (comment === null)
            return res
                .status(404)
                .json({ status: 404, msg: "Comment not found" })

        if (comment === undefined)
            return res
                .status(500)
                .json({ status: 500, msg: "Internal server error" })

        let commentRequack = await CommentRequack.getRequackId(
            user.id,
            comment.id
        )

        if (commentRequack === null)
            return res
                .status(404)
                .json({ status: 404, msg: "Comment not found" })

        if (commentRequack === undefined)
            return res
                .status(500)
                .json({ status: 500, msg: "Internal server error" })

        let commentRequackDelete = await CommentRequack.delete(
            commentRequack.id
        )

        if (commentRequackDelete === undefined)
            return res
                .status(500)
                .json({ status: 500, msg: "Internal server error" })

        return res.status(200).json({ status: 200 })
    }
}
