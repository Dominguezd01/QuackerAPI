import { Request, Response } from "express"
import { User } from "../models/User"
import { Quack } from "../models/Quack"
import { Requack } from "../models/Requack"
export class RequackController {
    static async requack(req: Request, res: Response): Promise<Response> {
        let userData = await req.body

        if (!userData || !userData.quackId)
            return res.status(400).json({ status: 400, msg: "Wrong data" })

        let user = await User.getUserById(userData.token.id)
        let quack = await Quack.getQuackByQuackId(userData.quackId)

        if (user === null) {
            return res.status(404).json({ status: 404, msg: "User not found" })
        }

        if (user === undefined)
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })

        if (quack === undefined)
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })
        if (quack === null) {
            return res.status(404).json({ status: 404, msg: "Quack not found" })
        }

        let requack = await Requack.create(user?.id, quack.id)

        if (requack === undefined)
            return res.status(500).json({ status: 500, msg: "Error" })

        return res.status(200).json({ status: 200, msg: "Requacked" })
    }

    static async deleteRequack(req: Request, res: Response): Promise<Response> {
        let userData = await req.body

        if (!userData || !userData.quackId)
            return res.status(400).json({ status: 400, msg: "Wrong data" })

        let user = await User.getUserById(userData.token.id)
        let quack = await Quack.getQuackByQuackId(userData.quackId)

        if (user === null) {
            return res.status(404).json({ status: 404, msg: "User not found" })
        }

        if (user === undefined)
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })

        if (quack === undefined)
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })

        if (quack === null)
            return res.status(404).json({ status: 404, msg: "Quack not found" })

        let requack = await Requack.getRequackId(user.id, quack.id)
        if (requack === undefined) {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong, try again later",
            })
        }

        if (requack !== null) {
            let deleteRequack = Requack.delete(requack.id)

            if (deleteRequack === undefined)
                return res.status(500).json({
                    status: 500,
                    msg: "Something went wrong, try again later",
                })

            return res.status(200).json({ status: 200, msg: "Delete requack" })
        }
        return res.status(200).json({ status: 200, msg: "Delete requack" })
    }
}
