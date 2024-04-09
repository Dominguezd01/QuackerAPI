import { PrismaClient, quacks, user_follows, users } from "@prisma/client"
import { Request, Response } from "express"
import { Quack } from "../models/Quack"
import { User } from "../models/User"
import { UserQuackLike } from "../models/UserQuackLike"
export class UserQuackLikeController {
    static async likeQuack(req: Request, res: Response): Promise<Response> {
        let userData = await req.body
        if (!userData || !userData.quackId) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check data provided" })
        }
        let quack = await Quack.getQuackByQuackId(userData.quackId)
        let user = await User.getUserById(userData.token.id)

        if (quack === null) {
            return res.status(404).json({ status: 404, msg: "Quack not found" })
        }

        if (quack === undefined) {
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

        let quackLike = await UserQuackLike.likeQuack(user.id, quack.id)

        if (quackLike === undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong try again later",
            })
        }

        if (quackLike === false) {
            return res
                .status(400)
                .json({ status: 400, msg: "Post already liked" })
        }
        return res.status(200).json({ status: 200, msg: "Quack liked" })
    }

    static async disLikeQuack(req: Request, res: Response): Promise<Response> {
        let userData = await req.body
        if (!userData || !userData.quackId) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check data provided" })
        }
        let quack = await Quack.getQuackByQuackId(userData.quackId)
        let user = await User.getUserById(userData.token.id)
        if (quack === null) {
            return res.status(404).json({ status: 404, msg: "Quack not found" })
        }

        if (quack === undefined) {
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

        let quackDislike = await UserQuackLike.findByUserIdAndQuackId(
            user.id,
            quack.id
        )

        if (quackDislike === null) {
            return res.status(200).json({ status: 200, msg: "Disliked" })
        }

        if (quackDislike === undefined)
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })

        let quackDisLikeRes = await UserQuackLike.disLikeQuack(quackDislike.id)

        if (quackDisLikeRes === undefined)
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong try again later",
            })

        return res.status(200).json({ status: 200, msg: "Quack disliked" })
    }
}
