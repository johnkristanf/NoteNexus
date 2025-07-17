// types/next-auth.d.ts
import NextAuth from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            name: string
            email: string
            image?: string
            theme?: string // Add your custom property here
        }
    }

    interface User {
        id: string
        name: string | null
        email: string | null
        image?: string | null
        theme?: string | null
        password?: string | null
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        name: string
        email: string
        image?: string
        theme?: string
    }
}
