import { PrismaClient, user_follows, users } from "@prisma/client"
import { checkPass, encodePass } from "../lib/passwordFunctions"

import { v4 as uuidv4 } from "uuid"
import { EmailsController } from "../controllers/EmailsController"
const prisma = new PrismaClient()
export class User {
  static async createUser(reqBody: any, host: string | undefined): Promise<boolean | undefined | null> {
    let { display_name, email, password, user_name } = reqBody
    if (!display_name || !email || !password || !user_name) {
      return undefined
    }
    try {
      let user = await prisma.users.findFirst({
        where: {
          OR: [{
            user_name: {
              equals: user_name
            },
            email: {
              equals: email
            }
          }]
        }
      })
      if (user != null) return null
      user = await prisma.users.create({
        data: {
          display_name: display_name,
          email: email,
          password: await encodePass(password),
          email_is_valid: false,
          is_active: false,
          user_id: uuidv4(),
          user_name: user_name,
        },
      })

      EmailsController.sendEmailRegister(user, host)
      return true
    } catch (ex) {
      console.log(ex)
      return false
    }
  }


  static async getUserByUserName(userName: string, password: string): Promise<users | null | undefined> {
    try {
      let user = await prisma.users.findFirst({
        where: {
          user_name: userName,
        },
      })

      if (user == null) return null
      if (await checkPass(password, user.password)) {
        return user
      }

      return null



    } catch (ex) { }
  }



  static async getUserByUserEmail(email: string, password: string): Promise<users | null | undefined> {
    try {
      let user = await prisma.users.findMany({
        where: {
          email: email,
          password: await encodePass(password)
        },
      })

      console.log(user)
      if (user.length == 0) return null
      return user[0]
    } catch (ex) { }
  }

  /**
   * Look for a user with the "user_id" field provided
   * @param userId 
   */
  static async getUserByUserId(userId: string): Promise<users | null | undefined> {
    try {
      let user = await prisma.users.findFirst({
        where: {
          user_id: userId,
          is_active: false,
          email_is_valid: false
        }
      })
      if (user == null) return null

      return user
    } catch (e) {
      console.log(e)
    }
  }

  static async activateUser(user: users) {
    try {
      prisma.users.update({
        where: {
          id: user.id
        },
        data: {
          is_active: true,
          email_is_valid: true
        }
      })
    } catch (ex) {
      console.log(ex)
    }
  }
}
