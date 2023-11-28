import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { User } from "../models/User"
import { users } from "@prisma/client"

const SECRET_KEY: string = process.env.TOKEN_SECRET || "Secretito"
export class UsersControllers {

  static async register(req: Request, res: Response): Promise<any> {
    let { display_name, email, password, user_name } = await req.body
    if (!display_name || !email || !password || !user_name) {
      return res.status(400).json({ msg: "Something went wrong" })
    }

    let createUser = await User.createUser(await req.body, req.headers.host)
    if (createUser) {
      return res.status(200).json({ msg: "Welcome to Ducker, happy quacking!!" })
    } else if (createUser == undefined) {
      return res.status(400).json({ msg: "Check the data provided" })
    }
    return res.status(500).json({ msg: "Something went wrong" })
  }

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
    console.log(user)
    if (user != null || user != undefined) {
      const token = jwt.sign(user.user_name, SECRET_KEY)
      return res.json({ userId: user.user_id, token: token })

    }
  }

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
