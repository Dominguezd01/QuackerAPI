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

        let searchTerm: string = userData.searchTerm

        let user = await prisma.users.findFirst({
            where: { id: userData.token.id },
        })

        if (user === null) return res.status(401).json({ status: 401 })

        if (searchTerm.startsWith("@")) {
            searchTerm = searchTerm.split("@")[1]
            console.log("EMPIEZA POR @")
            let usersFound: any = await prisma.users.findMany({
                select: {
                    id: true,
                    user_name: true,
                    display_name: true,
                    profile_picture: true,
                    bio: true,
                    user_follows_user_follows_user_id_followedTousers: {
                        select: {
                            id: true,
                        },
                        where: {
                            user_id: user.id,
                        },
                    },
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

                    is_active: true,
                },
            })

            for (let user of usersFound) {
                user.followed =
                    user.user_follows_user_follows_user_id_followedTousers
                        .length !== 0
                user.isUser = user.id === userData.token.id
                delete user.id
                delete user.user_follows_user_follows_user_id_followedTousers
            }

            if (usersFound.length === 0) {
                searchResult.noResults = true
            } else {
                searchResult.noResults = false
                searchResult.users = usersFound
            }
            console.log(searchResult)
            return res
                .status(200)
                .json({ status: 200, searchResult: searchResult })
        } else {
            let usersFound: any[] = await prisma.users.findMany({
                select: {
                    id: true,
                    user_name: true,
                    display_name: true,
                    profile_picture: true,
                    bio: true,
                    user_follows_user_follows_user_id_followedTousers: {
                        select: {
                            id: true,
                        },
                        where: {
                            user_id: user.id,
                        },
                    },
                    _count: {
                        select: {
                            user_follows_user_follows_user_id_followedTousers:
                                true,
                            user_follows_user_follows_user_idTousers: true,
                        },
                    },
                },
                where: {
                    is_active: true,
                    user_name: {
                        contains: searchTerm,
                    },
                },
            })
            for (let user of usersFound) {
                user.followed =
                    user.user_follows_user_follows_user_id_followedTousers
                        .length !== 0
                user.isUser = user.id === userData.token.id
                delete user.id
                delete user.user_follows_user_follows_user_id_followedTousers
            }

            let usersFoundDisplayName: any[] = await prisma.users.findMany({
                select: {
                    id: true,
                    user_name: true,
                    display_name: true,
                    profile_picture: true,
                    bio: true,
                    user_follows_user_follows_user_id_followedTousers: {
                        select: {
                            id: true,
                        },
                        where: {
                            user_id: user.id,
                        },
                    },
                    _count: {
                        select: {
                            user_follows_user_follows_user_id_followedTousers:
                                true,
                            user_follows_user_follows_user_idTousers: true,
                        },
                    },
                },
                where: {
                    is_active: true,
                    display_name: {
                        contains: searchTerm,
                    },
                },
            })
            for (let user of usersFoundDisplayName) {
                user.followed =
                    user.user_follows_user_follows_user_id_followedTousers
                        .length !== 0

                user.isUser = user.id === userData.token.id
                delete user.id
                delete user.user_follows_user_follows_user_id_followedTousers
            }
            let quacksFound: any[] = await prisma.quacks.findMany({
                where: {
                    is_active: true,
                    content: {
                        contains: searchTerm,
                    },
                },

                select: {
                    id: true,
                    quack_id: true,
                    content: true,
                    creation_date: true,
                    parent_post_id: true,
                    is_quote: true,
                    is_reply: true,
                    is_active: true,
                    user_quack: {
                        select: {
                            users: {
                                select: {
                                    user_name: true,
                                    display_name: true,
                                    profile_picture: true,
                                    bio: true,
                                },
                            },
                        },
                    },
                    user_quack_like: {
                        select: {
                            post_id: true,
                        },
                        where: {
                            users: {
                                id: userData.token.id,
                            },
                        },
                    },
                    requacks: {
                        select: {
                            post_id: true,
                        },
                        where: {
                            users: {
                                id: userData.token.id,
                            },
                        },
                    },

                    _count: {
                        select: {
                            requacks: true,
                            //comments_comments_quack_id_commentedToquacks: true,
                            quack_comments: {
                                where: {
                                    comments: {
                                        is_active: true,
                                    },
                                },
                            },
                            user_quack_like: true,
                        },
                    },
                },
            })
            console.log({ usersFound, quacksFound, usersFoundDisplayName })

            if (
                usersFound.length === 0 &&
                quacksFound.length === 0 &&
                usersFoundDisplayName.length === 0
            ) {
                searchResult.noResults = true
            } else {
                searchResult.users = usersFound
                searchResult.users.push(...usersFoundDisplayName)
                searchResult.quacks = quacksFound
                searchResult.noResults = false
            }
            console.log(searchResult)
            return res
                .status(200)
                .json({ status: 200, searchResult: searchResult })
        }
    }
}
