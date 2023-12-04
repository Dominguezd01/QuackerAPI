import { Request, Response } from "express"
export class QuacksController {
    static async main(req: Request, res: Response) {
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
                content:
                    "Amazing quack with some funny joke about Fernando Alonso",
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

        return res.status(200).json({ status: 200, quacks: quacks })
    }
}
