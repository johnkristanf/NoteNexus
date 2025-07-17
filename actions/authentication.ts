'use client'

import { signIn, signOut } from 'next-auth/react'

export const signInOAuthAction = (provider: string, redirectTo?: string) => {
    signIn(provider, { redirectTo: redirectTo })
}

export const signInCredentialsAction = async (
    formData: FormData,
) => {
    const data = formData instanceof FormData ? Object.fromEntries(formData.entries()) : undefined
    const result = await signIn('credentials', {
        ...data,
        redirect: false, // or `redirect: false` if you want to handle manually
    })


    if (result?.error) {
        const error = result?.error || 'Unknown error occurred'
        return error
    }

    return 'SignInSuccessful'
}

export const signOutUser = (redirectTo?: string) => {
    signOut({ redirectTo: redirectTo })
}
