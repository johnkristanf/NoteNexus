'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '@/lib/api/user/post'
import { toast } from 'sonner'
import { SubmitHandler, useForm } from 'react-hook-form'
import { RegisterUser } from '@/types/user'
import { signInCredentialsAction } from '@/actions/authentication'

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
    } = useForm<RegisterUser>()

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (response) => {
            toast.success(response.message)

            const formData = new FormData();
            formData.append('email', getValues('email'))
            formData.append('password', getValues('password'))

            // AUTO SIGN IN AFTER REGISTRATION
            signInCredentialsAction(formData)

            reset()

        },

        onError: (error) => {
            toast.error(error.message || 'Unexpected error occurred')
        },
    })

    const onSubmit: SubmitHandler<RegisterUser> = (data) => {
        mutation.mutate(data)
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        Welcome to Note <span className="text-violet-600">Nexus</span>
                    </CardTitle>
                    <CardDescription>Sign up for an account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    {...register('name', { required: 'Name is required' })}
                                    placeholder="John Kristan"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    placeholder="m@example.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters',
                                        },
                                    })}
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full hover:cursor-pointer"
                            >
                                {mutation.isPending ? 'Creating account...' : 'Sign Up'}
                            </Button>
                        </div>

                        <div className="text-center text-sm">
                            Already have an account?{' '}
                            <Link href="/signin" className="underline underline-offset-4">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className=" *:[a]:hover:opacity-75 text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
