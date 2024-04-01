import { quacks, users } from "@prisma/client"

export type searchResult = {
    users?: any[]
    quacks?: quacks[]
}
