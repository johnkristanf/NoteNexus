'use client'

import { signIn, signOut } from 'next-auth/react'

export const signInOAuthAction = (provider: string, redirectTo?: string) => {
    signIn(provider, { redirectTo: redirectTo })
}

export const signInCredentialsAction = (formData?: FormData) => {
    const data = formData instanceof FormData ? Object.fromEntries(formData.entries()) : undefined
    signIn('credentials', {
        ...data,
        callbackUrl: '/new-chat', // or `redirect: false` if you want to handle manually
    })
}

export const signOutUser = (redirectTo?: string) => {
    signOut({ redirectTo: redirectTo })
}
