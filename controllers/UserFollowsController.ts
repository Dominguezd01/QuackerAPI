import { Request, Response } from "express"
import { User } from "../models/User"
import { UserFollows } from "../models/UserFollows"
export class UserFollowsController {
    static async follow(req: Request, res: Response): Promise<Response> {
        const userData = await req.body

        if (!userData || !userData.userId || !userData.userFollowedId) {
            return res
                .status(400)
                .json({ status: 400, msg: "Something went wrong" })
        }

        if (userData.userId == userData.userFollowedId)
            return res
                .status(400)
                .json({ status: 400, msg: "You cant follow your own account" })

        let user = await User.getUserByUserId(userData.userId)
        let userFollowed = await User.getUserByUserId(userData.userFollowedId)

        if (!user || !userFollowed)
            return res
                .status(500)
                .json({ status: 500, msg: "Something went really wrong" })

        let followExists = await UserFollows.checkIfFollow(
            user?.id,
            userFollowed?.id
        )

        if (followExists)
            return res
                .status(400)
                .json({ status: 400, msg: "You already follow that account" })

        if (followExists == null) {
            return res
                .status(500)
                .json({ status: 500, msg: "Something went wrong" })
        }

        let followed = await UserFollows.follow(user.id, userFollowed.id)

        if (followed == null)
            return res
                .status(500)
                .json({ status: 500, msg: "Something went really wrong" })

        if (!followed)
            return res
                .status(400)
                .json({ status: 400, msg: "Error following the user :C" })

        return res.status(200).json({
            status: 200,
            msg: `User ${userFollowed.display_name} followed`,
        })
    }
}
