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

export async function setUserThemePreference(themeData: { user_id: string; theme: string }) {
    try {
        const res = await fetch('/api/user/theme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(themeData),
        })

        const json = await res.json()

        if (!res.ok) {
            const error = new Error(json.error || 'Something went wrong.')
            throw error
        }

        return {
            message: json.message,
            userId: json.userId,
        }
    } catch (error: any) {
        console.error('Set Theme Error:', error)
        throw error
    }
}
