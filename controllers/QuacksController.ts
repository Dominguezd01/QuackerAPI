import { Request, Response } from "express"
import { Quack } from "../models/Quack"
import { UserQuack } from "../models/UserQuack"
import { PrismaClient } from "@prisma/client"
import { User } from "../models/User"
const prisma = new PrismaClient()

export class QuacksController {
    /**
     * Sends the quacks the user would like
     * @param req Request object
     * @param res Response object
     */
    static async main(req: Request, res: Response): Promise<Response> {
        let userData = await req.body
        console.log(userData)
        if (!userData || !userData.userId)
            return res
                .status(400)
                .json({ status: 400, msg: "Something went wrong" })

        let quacks = await Quack.mainPage(userData.token.id)

        if (quacks == null)
            return res
                .status(500)
                .json({ status: 500, msg: "Something went wrong" })

        return res.status(200).json({ status: 200, quacks: quacks })
    }

    /**
     * Return the quack by the ID is provided in the URL
     * @param req Request object
     * @param res Response object
     */
    static async getQuackById(req: Request, res: Response): Promise<Response> {
        let params = req.params
        let body = await req.body
        if (!params || !params.quack_id || !body || !body.userId)
            return res
                .status(400)
                .json({ status: 400, msg: "Check data provided" })

        let quack = await Quack.getQuackInfo(params.quack_id, body.token.id)

        if (quack === null) {
            return res.status(404).json({ status: 404, msg: "Quack not found" })
        }

        if (quack === undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })
        }

        return res.status(200).json({ status: 200, quack: quack })
    }

    static async createQuack(req: Request, res: Response): Promise<Response> {
        try {
            const userData = await req.body

            if (
                !userData.userId ||
                userData.userId.trim() == "" ||
                !userData.content ||
                userData.content.trim() == "" ||
                userData.isReply === undefined ||
                userData.isQuote === undefined ||
                userData.parentPost === undefined
            ) {
                return res
                    .status(400)
                    .json({ status: 400, msg: "Check data provided" })
            }

            if (userData.content.lenght > 500)
                res.status(400).json({ status: 400, msg: "Content too long" })

            let user = await User.getUserById(userData.token.id)

            if (user === null)
                return res.status(401).json({ status: 401, msg: "Unathorized" })

            if (user === undefined)
                return res
                    .status(500)
                    .json({ status: 500, msg: "Something went wrong" })

            let quackCreate = await Quack.create(
                userData.userId,
                userData.content,
                userData.isReply,
                userData.isQuote,
                userData.parentPost
            )

            if (quackCreate === undefined)
                return res
                    .status(500)
                    .json({ status: 500, msg: "Something went really wrong" })

            if (quackCreate === null) {
                return res
                    .status(500)
                    .json({ status: 500, msg: "Something went really wrong" })
            }

            return res.status(200).json({ status: 200, quack: quackCreate })
        } catch (ex) {
            console.log(ex)

            return res
                .status(500)
                .json({ status: 500, msg: "Something went really bad" })
        }
    }
}
