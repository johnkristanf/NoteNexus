import bcrypt from 'bcryptjs'

export async function saltAndHashPassword(password: string, saltRounds: number) {
    return await bcrypt.hash(password, saltRounds)
}

export async function comparePassword(plain: string, hashed: string) {
    return await bcrypt.compare(plain, hashed)
}
