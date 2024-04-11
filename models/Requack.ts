import {
    PrismaClient,
    quacks,
    requacks,
    user_follows,
    users,
} from "@prisma/client"
const prisma = new PrismaClient()
export class Requack {
    /**
     * Creates the requack
     * @param userId user id who requacks
     * @param quackId quack id to requack
     */
    static async create(
        userId: number,
        quackId: number
    ): Promise<boolean | undefined> {
        try {
            let requack = await prisma.requacks.create({
                data: {
                    user_id: userId,
                    post_id: quackId,
                },
            })
            return true
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    /**
     * Deletes the requack
     * @param quackId user id who requacks
     * @returns true | undefined
     */
    static async delete(requackId: number): Promise<boolean | undefined> {
        try {
            let requack = await prisma.requacks.delete({
                where: {
                    id: requackId,
                },
            })
            return true
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }

    static async getRequackId(
        userId: number,
        quackId: number
    ): Promise<requacks | null | undefined> {
        try {
            let requack = await prisma.requacks.findFirst({
                where: {
                    user_id: userId,
                    post_id: quackId,
                },
            })

            return requack
        } catch (ex) {
            console.error(ex)
            return undefined
        }
    }
}
