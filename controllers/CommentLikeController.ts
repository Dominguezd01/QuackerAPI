import { Request, Response } from "express"
import { Comment } from "../models/Comment"
import { User } from "../models/User"
import { CommentLike } from "../models/CommentLike"
export class CommentLikeController {
    static async likeQuack(req: Request, res: Response): Promise<Response> {
        let userData = await req.body
        if (!userData || !userData.commentId) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check data provided" })
        }
        let comment = await Comment.getCommentByCommentId(userData.commentId)
        let user = await User.getUserById(userData.token.id)

        if (comment === null) {
            return res.status(404).json({ status: 404, msg: "Quack not found" })
        }

        if (comment === undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })
        }

        if (user === null) {
            return res.status(404).json({ status: 404, msg: "User not found" })
        }

        if (user === undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })
        }

        let commentLike = await CommentLike.likeComment(user.id, comment.id)

        if (commentLike === undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong try again later",
            })
        }

        if (commentLike === false) {
            return res
                .status(400)
                .json({ status: 400, msg: "Post already liked" })
        }
        return res.status(200).json({ status: 200, msg: "Comment liked" })
    }

    static async disLikeQuack(req: Request, res: Response): Promise<Response> {
        let userData = await req.body
        if (!userData || !userData.commentId) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check data provided" })
        }
        let comment = await Comment.getCommentByCommentId(userData.commentId)
        let user = await User.getUserById(userData.token.id)
        if (comment === null) {
            return res
                .status(404)
                .json({ status: 404, msg: "Comment not found" })
        }

        if (comment === undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })
        }
        if (user === null) {
            return res.status(404).json({ status: 404, msg: "User not found" })
        }

        if (user === undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })
        }

        let commentDislike = await CommentLike.findByUserIdAndCommentId(
            user.id,
            comment.id
        )

        if (commentDislike === null) {
            return res.status(200).json({ status: 200, msg: "Disliked" })
        }

        if (commentDislike === undefined)
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })

        let quackDisLikeRes = await CommentLike.disLikeQuack(commentDislike.id)

        if (quackDisLikeRes === undefined)
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong try again later",
            })

        return res.status(200).json({ status: 200, msg: "Comment disliked" })
    }
}
