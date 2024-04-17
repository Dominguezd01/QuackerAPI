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
        if (!params || !params.quack_id || !body)
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
            if (userData.content.length > 135) {
                return res
                    .status(413)
                    .json({ status: 413, msg: "Content too long" })
            }
            let user = await User.getUserById(userData.token.id)

            if (user === null)
                return res.status(401).json({ status: 401, msg: "Unathorized" })

            if (user === undefined)
                return res
                    .status(500)
                    .json({ status: 500, msg: "Something went wrong" })

            let quackCreate = await Quack.create(
                user.id,
                userData.content,
                userData.isReply,
                userData.isQuote,
                userData.parentPost
            )

            if (quackCreate === undefined) {
                return res
                    .status(500)
                    .json({ status: 500, msg: "Something went really wrong" })
            }

            if (quackCreate === null) {
                return res
                    .status(500)
                    .json({ status: 500, msg: "Something went really wrong" })
            }
            let quackCreatedInfo = await Quack.getQuackAndInfoById(
                quackCreate.id,
                user.id
            )
            return res
                .status(200)
                .json({ status: 200, quack: quackCreatedInfo })
        } catch (ex) {
            console.error(ex)
            return res
                .status(500)
                .json({ status: 500, msg: "Something went really bad" })
        }
    }

    static async getUserQuacks(req: Request, res: Response): Promise<Response> {
        let userData = await req.body

        if (!userData || !userData.checkProfileName) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check data provided" })
        }

        let user = await User.getUserById(userData.token.id)
        let userCheck = await User.getUserInfoByUserName(
            userData.checkProfileName
        )

        if (user === null) {
            return res.status(401)
        }
        if (userCheck === null) {
            return res
                .status(404)
                .json({ status: 404, msg: "The user you wanted doesnt exists" })
        }

        if (user === undefined || userCheck === undefined) {
            return res
                .status(500)
                .json({ status: 500, msg: "Internal server error" })
        }

        let quacks = await Quack.getUserCheckedQuacks(user.id, userCheck.id)

        if (quacks === null) {
            return res.status(404).json({ status: 404 })
        }

        if (quacks === undefined) return res.status(500).json({ status: 500 })

        return res.status(200).json({ status: 200, quacks: quacks })
    }

    static async editQuack(req: Request, res: Response): Promise<Response> {
        const userData = await req.body
        console.log(userData)
        if (
            !userData ||
            !userData.quackId ||
            !userData.content ||
            userData.content.trim() === ""
        ) {
            return res
                .status(400)
                .json({ status: 400, msg: "Quack id or content missing" })
        }

        if (userData.content.length > 135) {
            return res
                .status(413)
                .json({ status: 413, msg: "Content too long" })
        }

        let user = await User.getUserById(userData.token.id)
        let quack = await Quack.getQuackByQuackIdIsActive(userData.quackId)

        if (user === undefined || quack === undefined) {
            return res.status(500).json({ status: 500 })
        }

        if (user === null) {
            return res.status(401).json({ status: 401, msg: "Unauthorized" })
        }

        if (quack === null) {
            return res.status(404).json({ status: 404, msg: "Quack not found" })
        }

        let isUserQuack = await UserQuack.isUserQuack(user.id, quack.id)

        if (isUserQuack === undefined) {
            return res.status(500).json({ status: 500 })
        }

        if (!isUserQuack) {
            return res.status(403).json({ status: 403, msg: "Forbidden" })
        }

        let edit = await Quack.edit(quack.id, userData.content)

        if (edit == undefined) {
            return res.status(500).json({ status: 500 })
        }
        console.log("NO ES TUYO")
        return res.status(200).json({ status: 200 })
    }

    static async deleteQuack(req: Request, res: Response): Promise<Response> {
        const userData = await req.body

        if (!userData || !userData.quackId) {
            return res
                .status(400)
                .json({ status: 400, msg: "Quack id missing" })
        }

        let user = await User.getUserById(userData.token.id)

        let quack = await Quack.getQuackByQuackIdIsActive(userData.quackId)
        if (user === undefined || quack === undefined) {
            return res.status(500).json({ status: 500 })
        }

        if (user === null) {
            return res.status(401).json({ status: 401, msg: "Unauthorized" })
        }

        if (quack === null) {
            return res.status(404).json({ status: 404, msg: "Quack not found" })
        }

        let isUserQuack = await UserQuack.isUserQuack(user.id, quack.id)

        if (isUserQuack === undefined) {
            return res.status(500).json({ status: 500 })
        }

        if (!isUserQuack) {
            return res.status(403).json({ status: 403, msg: "Forbidden" })
        }

        let quackDeleted = await Quack.delete(quack.id)

        if (quackDeleted == undefined) {
            return res.status(500).json({ status: 500, msg: "Internal error" })
        }

        return res.status(200).json({ status: 200 })
    }
}
