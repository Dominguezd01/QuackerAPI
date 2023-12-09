export async function encodePass(pass: string): Promise<string> {
    const hash = await Bun.password.hash(pass, {
        algorithm: "argon2id",
        memoryCost: 4,
        timeCost: 3,
    })
    console.log("HASH NUEVO")
    console.log(hash)
    return hash
}

export async function checkPass(
    pass: string,
    hashedPass: string
): Promise<boolean> {
    return await Bun.password.verify(pass, hashedPass, "argon2id")
}
