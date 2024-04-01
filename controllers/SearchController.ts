import { Request, Response } from "express"
import { Quack } from "../models/Quack"
import { UserQuack } from "../models/UserQuack"
import { PrismaClient } from "@prisma/client"
import { User } from "../models/User"
import { searchResult } from "../models/SearchResult"
const prisma = new PrismaClient()

export class SearchController {
    static async search(req: Request, res: Response) {
        const userData = await req.body
        let searchResult: searchResult = {}
        if (!userData || !userData.searchTerm) {
            return res
                .status(400)
                .json({ status: 400, msg: "Check data provided" })
        }

        const searchTerm: string = userData.searchTerm

        if (searchTerm.startsWith("@")) {
            let usersFound = await prisma.users.findMany({
                select: {
                    user_name: true,
                    display_name: true,
                    profile_picture: true,

                    _count: {
                        select: {
                            user_follows_user_follows_user_id_followedTousers:
                                true,
                            user_follows_user_follows_user_idTousers: true,
                        },
                    },
                },
                where: {
                    user_name: {
                        contains: searchTerm,
                    },
                    AND: {
                        is_active: true,
                    },
                },
            })

            searchResult.users = usersFound

            return res
                .status(200)
                .json({ status: 200, searchResult: searchResult })
        }
    }
}
