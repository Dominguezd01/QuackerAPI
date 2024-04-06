import { users } from "@prisma/client"
import jwt from "jsonwebtoken"
const SECRET_KEY: string = process.env.TOKEN_SECRET || "SECRETITO"
export function generateToken(user: users){
    return jwt.sign(JSON.stringify({id: user.id, userName: user.user_name}), SECRET_KEY)
}