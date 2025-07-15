import { RegisterUser, User } from '@/types/user'

export async function registerUser(user: RegisterUser) {
    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })

        const json = await res.json()

        if (!res.ok) {
            const error = new Error(json.error || 'Something went wrong.')
            // @ts-ignore (optionally attach metadata)
            error.details = json.details
            throw error
        }

        return {
            message: json.message,
            userId: json.userId,
        }
    } catch (error: any) {
        console.error('Registration Error:', error)
        throw error
    }
}
