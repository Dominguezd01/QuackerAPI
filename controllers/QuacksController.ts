import { Request, Response } from "express"
import { Quack } from "../models/Quack"
/**
 * This is just a place holder dw
 */
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
export class QuacksController {
    /**
     * Sends the quacks the user would like
     * @param req Request object
     * @param res Response object
     */
    static async main(req: Request, res: Response): Promise<Response> {
        return res.status(200).json({ status: 200, quacks: quacks })
    }

    /**
     * Return the quack by the ID is provided in the URL
     * @param req Request object
     * @param res Response object
     */
    static async getQuackById(req: Request, res: Response): Promise<Response> {
        let params = req.params
        console.log(params)
        if (!params.quack_id)
            return res
                .status(400)
                .json({ status: 400, msg: "Something went wrong" })

        let quack = quacks.find(
            (quack) => quack.id == parseInt(params.quack_id)
        )

        if (!quack)
            return res.status(404).json({ status: 404, msg: "Quack not found" })

        return res.status(200).json({ quack: quack })
    }

    static async createQuack(req: Request, res: Response): Promise<Response> {
        let { userId, content, isReply, isQuote, parentPost } = await req.body

        if (!userId || userId.trim() == "" || !content || content.trim() == "")
            return res
                .status(400)
                .json({ status: 400, msg: "Check data provided" })

        Quack.create(userId, content, isReply, isQuote, parentPost)
        // AQUI TE QUEDASTE ANTES DE QUE TE DIERA PEREZA PUTO VAGO DE MIERDA
        return res.send()
    }
}
