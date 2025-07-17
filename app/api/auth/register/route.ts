import { existingUserByEmail, insertNewUser, insertUserAccount } from '@/database/queries/user'
import { signUpSchema } from '@/lib/zod'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { Account } from 'next-auth'
import { ZodError } from 'zod'
import { User } from '@/types/user'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password } = signUpSchema.parse(body)

        const isExistingUser = await existingUserByEmail(email)
        if (isExistingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists.' },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user: User = {
            name,
            email,
            image: null,
            password: hashedPassword,
        }

        const isEmailVerified = false
        const newUser = await insertNewUser(user, isEmailVerified)

        const account: Account = {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: user.email,
        }

        await insertUserAccount(newUser.id, account)

        return NextResponse.json(
            { message: 'Registration Successful. Logging you In...', userId: String(newUser.id) },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.issues },
                { status: 400 }
            )
        }

        console.error('❌ Registration failed:', error)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again later.' },
            { status: 500 }
        )
    }
}
