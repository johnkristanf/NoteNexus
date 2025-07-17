import NextAuth from 'next-auth'
import {
    existingUserByEmail,
    existingUserById,
    getUserFromDb,
    insertNewUser,
    insertUserAccount,
} from './database/queries/user'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { comparePassword } from './lib/bcrypt'
import { signInSchema } from './lib/zod'
import { User } from './types/user'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'openid email profile',
                },
            },
        }),

        CredentialsProvider({
            credentials: {
                email: {
                    type: 'email',
                },
                password: {
                    type: 'password',
                },
            },

            authorize: async (credentials) => {
                const { email, password } = await signInSchema.parseAsync(credentials)

                const user = await getUserFromDb(email)
                if (!user || !user.password) return null
                const isValid = await comparePassword(password, user.password)
                if (!isValid) return null

                return user
            },
        }),
    ],

    callbacks: {
        async jwt({ token, account, profile, trigger, session }) {
            console.log('account: ', account)
            console.log('profile: ', profile)

            if (trigger === 'update') {
                if (session?.theme) {
                    token.theme = session.theme
                }
                return token
            }

            // OAUTH LOGIN
            if (account && profile) {
                const user = await existingUserByEmail(profile.email!)

                // REGISTERS OAUTH USER
                if (!user) {
                    const user = {
                        id: profile.sub as string,
                        name: profile.name!,
                        email: profile.email!,
                        image: profile.picture,
                    }

                    const newUser = await insertNewUser(user, profile.email_verified!)
                    await insertUserAccount(newUser.id, account)

                    token.id = newUser.id
                    token.name = newUser.name
                    token.email = newUser.email
                    token.image = newUser.image
                    token.theme = newUser.theme

                    return token
                }

                // IF USER ALREADY EXISTS INSIDE DATABASE
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.image = user.image
                token.theme = user.theme

                return token
            }

            // CREDENTIALS LOGIN (THE REGISTRATION PROCESS IS HANDLE BY DIFFERENT ENDPOINT)
            if (account) {
                const user = await existingUserById(account.providerAccountId)
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.image = user.image
                token.theme = user.theme
            }

            return token
        },
        async session({ session, token }) {
            console.log('token inside session: ', token)

            session.user.id = token.id as string
            session.user.name = token.name as string
            session.user.email = token.email as string
            session.user.image = token.image as string
            session.user.theme = token.theme as string
            return session
        },
    },
})
