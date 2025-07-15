import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import ReactQueryProvider from '@/components/react-query-provider'
import { SessionProvider } from 'next-auth/react'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'NoteNexus',
    description: 'AI-based study note-taking application',
    icons: {
        icon: '/note_nexus_logo.svg',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
                <SessionProvider>
                    <ReactQueryProvider>
                        <main>{children}</main>
                        <Toaster position="top-right" />
                    </ReactQueryProvider>
                </SessionProvider>
            </body>
        </html>
    )
}
