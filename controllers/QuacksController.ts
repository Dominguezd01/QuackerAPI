import { Request, Response } from "express"
import { Quack } from "../models/Quack"
import { UserQuack } from "../models/UserQuack"
import { PrismaClient } from "@prisma/client"
import { User } from "../models/User"
const prisma = new PrismaClient()
/**
 * This is just a place holder dw
 */
/**
let quacks = [
    {
        id: 1,
        content: "Amazing quack with some funny joke about your mother",
        author: "@Dominguezd01",
        displayAuthor: "Dominguezd01",
        photoAuthor: "./static/static/defaultProfilePicture.svg",
        like: true,
        repost: false,
        likeCount: 33,
        requacksCount: 1433,
        commentCount: 777,
    },
    {
        id: 2,
        content: "Amazing quack with some funny joke about Fernando Alonso",
        author: "@Dominguezd02",
        displayAuthor: "Dominguezd02",
        photoAuthor: "defaultProfilePicture.svg",
        like: true,
        repost: false,
        likeCount: 33,
        requacksCount: 1433,
        commentCount: 777,
    },
    {
        id: 3,
        content: "Amazing quack with some funny joke about your mother",
        author: "@Dominguezd01",
        displayAuthor: "Dominguezd01",
        photoAuthor: "defaultProfilePicture.svg",
        like: true,
        repost: false,
        likeCount: 33,
        requacksCount: 1433,
        commentCount: 777,
    },
    {
        id: 4,
        content: "Amazing quack with some funny joke about your mother",
        author: "@Dominguezd01",
        displayAuthor: "Dominguezd01",
        photoAuthor: "defaultProfilePicture.svg",
        like: false,
        repost: true,
        likeCount: 33,
        requacksCount: 1433,
        commentCount: 777,
    },
    {
        id: 5,
        content: "Amazing quack with some funny joke about your mother",
        author: "@Dominguezd01",
        displayAuthor: "Dominguezd01",
        photoAuthor: "defaultProfilePicture.png",
        like: true,
        repost: false,
        likeCount: 33,
        commentCount: 777,
        requacksCount: 1433,
    },
]
*/
export class QuacksController {
    /**
     * Sends the quacks the user would like
     * @param req Request object
     * @param res Response object
     */
    static async main(req: Request, res: Response): Promise<Response> {
        let userData = await req.body
        if (!userData || !userData.userId)
            return res
                .status(400)
                .json({ status: 400, msg: "Something went wrong" })

        console.log(await req.body)
        let quacks = await Quack.mainPage(userData.userId)
        return res.status(200).json({ status: 200, quacks: quacks })
    }

    /**
     * Return the quack by the ID is provided in the URL
     * @param req Request object
     * @param res Response object
     */
    static async getQuackById(req: Request, res: Response): Promise<Response> {
        let params = req.params
        let quacks = await prisma.quacks.findMany()
        console.log(params)
        if (!params.quack_id)
            return res
                .status(400)
                .json({ status: 400, msg: "Something went wrong" })

        let quack = quacks?.find(
            (quack) => quack.id == parseInt(params.quack_id)
        )

        if (!quack)
            return res.status(404).json({ status: 404, msg: "Quack not found" })

        return res.status(200).json({ quack: quack })
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

            let user = await User.getUserByUserId(userData.userId)

            if (user == null)
                return res.status(401).json({ status: 401, msg: "Unathorized" })

            if (user == undefined)
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

            if (quackCreate == undefined)
                return res
                    .status(500)
                    .json({ status: 500, msg: "Something went really wrong" })

            if (quackCreate == null) {
                return res
                    .status(500)
                    .json({ status: 500, msg: "Something went really wrong" })
            }

            if (user == null) {
                await Quack.delete(quackCreate?.id)
                return res
                    .status(404)
                    .json({ status: 404, msg: "The user doesnt exists" })
            }

            return res
                .status(500)
                .json({ status: 500, msg: "Something went really bad" })
        } catch (ex) {
            console.log(ex)

            return res
                .status(500)
                .json({ status: 500, msg: "Something went really bad" })
        }
    }
}
