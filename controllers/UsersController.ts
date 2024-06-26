import { json, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { User } from "../models/User"
import { users } from "@prisma/client"
import { getViewsDir } from "../lib/getViewsDir"
import { generateToken } from "../lib/generateToken"

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
            user_name_user.includes("@") ||
            !profilePicture
        ) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check data provided" })
        }

        let createUser = await User.createUser(await req.body, req.headers.host)

        if (createUser) {
            return res.status(200).json({
                status: 200,
                msg: "Check your email to verify your account!!!",
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

            let user
            if (identifier.includes("@")) {
                user = await User.getUserByUserEmail(identifier, password)
            } else {
                user = await User.getUserByUserName(identifier, password)
            }

            if (user === null) {
                return res
                    .status(401)
                    .json({ status: 401, msg: "Wrong identifier or password" })
            }

            if (user === undefined) {
                return res
                    .status(500)
                    .json({ status: 500, msg: "Oops...Something broke" })
            }

            const token = generateToken(user)
            return res.status(200).json({
                status: 200,
                profileImage: user.profile_picture,
                userName: user.user_name,
                userDisplayName: user.display_name,
                token: token,
            })
        } catch (ex) {
            console.error(ex)
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

    static async getUserProfile(
        req: Request,
        res: Response
    ): Promise<Response> {
        let userData = req.params

        if (!userData || !userData.userName) {
            return res.status(400).json({
                status: 400,
                msg: "The data provided is not valid",
            })
        }

        let userInfo = await User.getUserProfile(
            await req.body.token.id,
            userData.userName
        )

        if (userInfo == null)
            return res
                .status(500)
                .json({ status: 500, msg: "Something went wrong" })

        return res.status(200).json({ status: 200, userInfo: userInfo })
    }

    static async getUserEditProfile(
        req: Request,
        res: Response
    ): Promise<Response> {
        let user = await User.getEditProfile(await req.body.token.id)

        if (user === null) {
            return res.status(404).json({ status: 404, msg: "User not found" })
        }

        if (user === undefined) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal server error" })
        }

        return res.status(200).json({ status: 200, userInfo: user })
    }

    static async editProfile(req: Request, res: Response) {
        let userData = await req.body

        if (
            !userData ||
            !userData.userName ||
            !userData.displayName ||
            !userData.bio ||
            !userData.profileImage
        ) {
            return res
                .status(400)
                .json({ status: 400, msg: "Some data is missing" })
        }

        let userCheck = await User.getUserById(userData.token.id)

        if (userCheck === undefined) return res.status(500)

        if (userCheck === null) {
            return res.status(401).json({ status: 401, msg: "Unauthorized" })
        }

        let user = await User.editUserProfile(
            userCheck.id,
            userData.displayName,
            userData.userName,
            userData.bio,
            userData.profileImage
        )

        if (user === undefined) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal server error" })
        }
        if (user.errors !== undefined) {
            return res.status(400).json({ status: 400, errors: user.errors })
        }

        return res.status(200).json({
            status: 200,
            userName: user.user_name,
            displayName: user.display_name,
            token: generateToken(user),
            profilePic: user.profile_picture,
        })
    }
}
