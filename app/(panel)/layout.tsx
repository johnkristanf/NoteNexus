'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'
import { MonitorCog, Moon, Sun } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PanelNavUser } from '@/components/panel-nav-user'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { setUserThemePreference } from '@/lib/api/user/post'
import { useNoteStore } from '@/store/noteStore'

export default function PanelLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { setTheme } = useTheme()
    const { data: session, update } = useSession()
    const user = session?.user

    const themes = [
        { name: 'Light', tag: 'light', icon: Sun },
        { name: 'Dark', tag: 'dark', icon: Moon },
        { name: 'System', tag: 'system', icon: MonitorCog },
    ]

    // DISABLING THE SIDEBAR TRIGGER WHEN CTRL + B IS PRESSED
    // AND ONLY APPLY TO QUILL EDITOR FOR BOLDING
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeEl = document.activeElement

            // Check if active element is inside a Quill editor
            const isInsideQuillEditor = !!activeEl?.closest('.ql-editor')

            const isStickyNoteOpen = useNoteStore((state) => state.isNoteOpen)

            if (
                (isStickyNoteOpen || isInsideQuillEditor) &&
                (e.ctrlKey || e.metaKey) &&
                e.key.toLowerCase() === 'b'
            ) {
                // Let Quill handle formatting but stop sidebar toggle
                e.stopImmediatePropagation()
                return
            }

            if (!isInsideQuillEditor && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault()
                e.stopImmediatePropagation()
                console.log('Ctrl+B prevented outside of note/editor')
            }
        }

        window.addEventListener('keydown', handleKeyDown, true)
        return () => {
            window.removeEventListener('keydown', handleKeyDown, true)
        }
    }, [])

    // SET THEME PREFERENCE MUTATION
    const mutation = useMutation({
        mutationFn: setUserThemePreference,
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const handleSetTheme = (theme: string) => {
        if (!user || !user.id) {
            console.warn('User ID is undefined. Theme update aborted.')
            return
        }

        const themeData = {
            user_id: user.id,
            theme,
        }

        setTheme(theme)

        mutation.mutate(themeData, {
            onSuccess: async () => {
                // Update session so user.theme is in sync
                await update({ theme })
            },
        })
    }

    // THEME SYNC WITH DATABASE VALUE
    useEffect(() => {
        if (user?.theme) {
            setTheme(user.theme)
        }
    }, [session?.user?.theme, setTheme])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="dark:bg-slate-900 flex items-center justify-between pr-5 h-12 gap-2 border-b">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                    </div>

                    <div className="flex items-center gap-2 ">
                        {/* THEME TOGGLE */}
                        {user && (
                            <Popover>
                                <PopoverTrigger>
                                    <Sun className="size-5 hover:cursor-pointer" />
                                </PopoverTrigger>
                                <PopoverContent className="w-32 flex flex-col !p-2">
                                    <div className="flex flex-col ">
                                        {themes.map((themed, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleSetTheme(themed.tag)}
                                                className={`flex items-center gap-2 text-sm hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-md ${
                                                    user.theme === themed.tag
                                                        ? 'font-semibold text-violet-600'
                                                        : ''
                                                }`}
                                            >
                                                <themed.icon className="size-4" />
                                                {themed.name}
                                            </button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}

                        {/* USER AVATAR DROPDOWN */}
                        {user && <PanelNavUser user={user} />}
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}
