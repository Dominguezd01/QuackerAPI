import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { User } from "../models/User"
import { users } from "@prisma/client"

const SECRET_KEY: string = process.env.TOKEN_SECRET || "Secretito"
export class UsersControllers {
    /**
     * Function to handle registers
     * @param req
     * @param res
     * @returns Promise needed to adapt
     */
    static async register(req: Request, res: Response): Promise<any> {
        let { display_name, emailUser, password, user_name_user } =
            await req.body

        if (!display_name || !emailUser || !password || !user_name_user) {
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
        const { identifier, password } = req.body

        if (!identifier || !password) {
            return res.status(400).json({ msg: "Something went wrong" })
        }

        let user: users | null | undefined = null
        if (identifier.includes("@")) {
            user = await User.getUserByUserEmail(identifier, password)
        } else {
            user = await User.getUserByUserName(identifier, password)
        }
        if (user != null || user != undefined) {
            const token = jwt.sign(user.user_name, SECRET_KEY)
            return res
                .status(200)
                .json({ status: 200, userId: user.user_id, token: token })
        }
        if (user == undefined)
            return res
                .status(500)
                .json({ status: 500, msg: "Oops...Something broke" })

        return res
            .status(401)
            .json({ status: 401, msg: "Wrong identifier or password" })
    }
    /**
     * Handles the verifying process of the users to active the account
     * @param req
     * @param res
     * @returns
     */
    static async verifyUser(req: Request, res: Response): Promise<any> {
        let { userId } = req.params

        if (!userId) return res.status(400).json({ msg: "Id is missing" })

        let user = await User.getUserByUserId(userId)

        if (user != null && user != undefined) {
            User.activateUser(user)
            return res.status(200).json({ msg: "Account activated" })
        }
        return res.status(400).json({ msg: "Account already active" })
    }
}
