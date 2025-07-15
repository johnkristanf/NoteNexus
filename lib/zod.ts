import { object, string, email } from 'zod'

export const signInSchema = object({
    email: email({ error: 'Invalid Email Address' }).min(1, 'Email is required'),

    password: string({ error: 'Password is required' })
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters'),
})

export const signUpSchema = object({
    name: string({ error: 'Password is required' }),
    email: email({ error: 'Invalid Email Address' }).min(1, 'Email is required'),
    password: string({ error: 'Password is required' })
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters'),
})
