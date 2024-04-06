export async function encodePass(pass: string): Promise<string> {
    const hash = await Bun.password.hash(pass, {
        algorithm: "bcrypt",
        cost: 4,
    })
    return hash
}

export async function checkPass(
    pass: string,
    hashedPass: string
): Promise<boolean> {
    return await Bun.password.verify(pass, hashedPass, "bcrypt")
}
