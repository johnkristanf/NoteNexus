import { eq } from 'drizzle-orm'
import { db } from '..'
import { accounts, users } from '../schema'
import { Account } from 'next-auth'
import type { AdapterAccountType } from '@auth/core/adapters'
import { User, UserWithTheme } from '@/types/user'

export async function existingUserByEmail(email: string): Promise<UserWithTheme | null> {
    try {
        const [user] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                theme: users.theme,
                image: users.image,
            })
            .from(users)
            .where(eq(users.email, email))

        return user ?? null
    } catch (error) {
        console.error('Error checking existingUser: ', error)
        throw error
    }
}

export async function existingUserById(id: string): Promise<UserWithTheme> {
    try {
        const [user] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                image: users.image,
                theme: users.theme,
            })
            .from(users)
            .where(eq(users.id, id))
            .limit(1)

        return user
    } catch (error) {
        console.error('Error checking existingUser: ', error)
        throw error
    }
}

export async function insertNewUser(user: User, isEmailVerified: boolean): Promise<UserWithTheme> {
    try {
        const [newUser] = await db
            .insert(users)
            .values({
                name: user.name,
                email: user.email,
                image: user.image,
                password: user.password,
                emailVerified: isEmailVerified ? new Date() : null,
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                image: users.image,
                theme: users.theme,
            })

        return newUser
    } catch (error) {
        console.error('Error inserting new user: ', error)
        throw error
    }
}

export async function insertUserAccount(user_id: string, account: Account) {
    try {
        await db.insert(accounts).values({
            userId: user_id, // from your user table
            type: account.type as AdapterAccountType,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token ?? null,
            refresh_token: account.refresh_token ?? null,
            id_token: account.id_token ?? null,
            scope: account.scope ?? null,
            token_type: account.token_type ?? null,
            expires_at: account.expires_at ?? null,
        })
    } catch (error) {
        console.error('Error inserting new user: ', error)
        throw error
    }
}

export async function getUserFromDb(email: string) {
    try {
        const existingUser = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                image: users.image,
                password: users.password,
            })
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

        if (existingUser.length > 0) {
            return existingUser[0]
        }

        return null
    } catch (error) {
        console.error('Error getting user from db: ', error)
        throw error
    }
}

export async function updateUserTheme(user_id: string, theme: string) {
    try {
        await db.update(users).set({ theme }).where(eq(users.id, user_id))
    } catch (error) {
        console.error('Error updating user theme preference: ', error)
        throw error
    }
}
