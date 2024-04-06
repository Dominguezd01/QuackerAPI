import { Request, Response } from "express"
import { User } from "../models/User"
import { UserFollows } from "../models/UserFollows"
export class UserFollowsController {
    static async follow(req: Request, res: Response): Promise<Response> {
        const userData = await req.body

        if (!userData || !userData.userNameFollowed) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check the data provided" })
        }

        if (userData.token.id === userData.userFollowedId)
            return res
                .status(418)
                .json({ status: 418, msg: "You cant follow your own account" })

        let user = await User.getUserById(userData.token.id)
        let userFollowed = await User.getUserInfoByUserName(
            userData.userNameFollowed
        )

        if (user === undefined || userFollowed === undefined) {
            return res
                .status(500)
                .json({ status: 500, msg: "Something went really wrong" })
        }

        if (user === null || userFollowed === null) {
            return res.status(400).json({ status: 400, msg: "Users not found" })
        }

        let followExists = await UserFollows.checkIfFollow(
            user?.id,
            userFollowed?.id
        )

        if (followExists)
            return res
                .status(204)
                .json({ status: 204, msg: "You already follow that account" })

        let followed = await UserFollows.follow(user.id, userFollowed.id)

        if (followed === undefined) {
            return res
                .status(500)
                .json({ status: 500, msg: "Something went really wrong" })
        }

        return res.status(200).json({
            status: 200,
            msg: `User ${userFollowed.user_name} followed`,
        })
    }

    static async unFollow(req: Request, res: Response): Promise<Response> {
        const userData = await req.body

        if (!userData || !userData.userNameFollowed) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check the data provided" })
        }

        if (userData.token.id === userData.userFollowedId)
            return res.status(418).json({
                status: 418,
                msg: "You cant unfollow your own account",
            })

        let user = await User.getUserById(userData.token.id)
        let userFollowed = await User.getUserInfoByUserName(
            userData.userNameFollowed
        )

        if (user === undefined || userFollowed === undefined) {
            return res
                .status(500)
                .json({ status: 500, msg: "Something went really wrong" })
        }

        if (user === null || userFollowed === null) {
            return res.status(400).json({ status: 400, msg: "Users not found" })
        }

        let followExists = await UserFollows.checkIfFollow(
            user?.id,
            userFollowed?.id
        )

        if (followExists === null)
            return res.status(200).json({ status: 200, msg: "Unfollowed" })

        if (followExists === undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })
        }

        let followed = await UserFollows.unFollow(followExists.id)

        if (followed === undefined) {
            return res
                .status(500)
                .json({ status: 500, msg: "Something went really wrong" })
        }

        return res.status(200).json({
            status: 200,
            msg: `User ${userFollowed.user_name} followed`,
        })
    }
}
