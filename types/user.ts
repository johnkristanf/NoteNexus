export type User = {
    id?: string
    name: string
    email: string
    image: string | null
    password?: string
}

export type RegisterUser = {
    name: string
    email: string
    password: string
}

export type UserWithTheme = {
    id: string
    name: string | null
    email: string | null
    theme: string | null
    image: string | null
}
