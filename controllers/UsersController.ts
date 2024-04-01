import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { User } from "../models/User"
import { users } from "@prisma/client"
import { getViewsDir } from "../lib/getViewsDir"

const SECRET_KEY: string = process.env.TOKEN_SECRET || "SECRETITO"

export class UsersControllers {
    /**
     * Function to handle registers
     * @param req
     * @param res
     * @returns Promise needed to adapt
     */
    static async register(req: Request, res: Response): Promise<any> {
        let {
            display_name,
            emailUser,
            password,
            user_name_user,
            profilePicture,
        } = await req.body

        if (
            !display_name ||
            !emailUser ||
            !password ||
            !user_name_user ||
            !profilePicture
        ) {
            return res
                .status(400)
                .json({ status: 400, msg: "Something went wrong" })
        }

        let createUser = await User.createUser(await req.body, req.headers.host)

        if (createUser) {
            return res.status(200).json({
                status: 200,
                msg: "Welcome to Ducker, happy quacking!!",
            })
        } else if (createUser == null) {
            return res.status(401).json({
                status: 401,
                msg: "Email or username already in use",
            })
        } else if (createUser == undefined) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check the data provided" })
        }
        return res
            .status(500)
            .json({ status: 500, msg: "Something went wrong" })
    }
    /**
     * Function to handle login users
     * @param req
     * @param res
     * @returns
     */
    static async login(req: Request, res: Response): Promise<any> {
        try {
            const { identifier, password } = req.body

            if (
                !identifier ||
                !password ||
                identifier.trim() == "" ||
                password.trim() == ""
            ) {
                return res
                    .status(400)
                    .json({ status: 400, msg: "Check the data provided" })
            }

            let user: users | null | undefined
            if (identifier.includes("@")) {
                user = await User.getUserByUserEmail(identifier, password)
            } else {
                user = await User.getUserByUserName(identifier, password)
            }

            if (user == null) {
                return res
                    .status(401)
                    .json({ status: 401, msg: "Wrong identifier or password" })
            }
            if (user == undefined) {
                return res
                    .status(500)
                    .json({ status: 500, msg: "Oops...Something broke" })
            }
            const token = jwt.sign(user.user_name, SECRET_KEY)
            return res.status(200).json({
                status: 200,
                userName: user.user_name,
                userDisplayName: user.display_name,
                userId: user.user_id,
                profileImage: user.profile_picture,
                token: token,
            })
        } catch (ex) {
            console.log(ex)
            return res
                .status(500)
                .json({ status: 500, msg: "Oops...Something broke" })
        }
    }
    /**
     * Handles the verifying process of the users to active the account
     * @param req
     * @param res
     * @returns
     */
    static async verifyUser(req: Request, res: Response): Promise<any> {
        let { userName } = req.params

        let user = await User.getUserDisabledByUserName(userName)
        if (user === undefined) {
            return res.sendFile(getViewsDir() + "500Error.html")
        }
        if (user != null && user != undefined) {
            if (!User.activateUser(user)) {
                return res.status(500).json({
                    status: 500,
                    msg: "Something went wrong trying to activate the user",
                })
            }
            return res.sendFile(getViewsDir() + "200.html")
        }
        return res
            .status(400)
            .json({ status: 400, msg: "Account already active" })
    }

    static async getUserProfile(req: Request, res: Response) {
        let userData = req.params

        if (!userData || !userData.userId || !userData.userProfileCheck) {
            return res.status(400).json({
                status: 400,
                msg: "The data provided is not valid",
            })
        }
        let userInfo = await User.getUserProfile(
            userData.userId,
            userData.userProfileCheck
        )

        if (userInfo == null)
            return res
                .status(500)
                .json({ status: 500, msg: "Something went wrong" })

        return res.status(200).json({ status: 200, userInfo: userInfo })
    }
}
