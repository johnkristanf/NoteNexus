'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect } from 'react'
import { MonitorCog, Moon, Sun } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PanelNavUser } from '@/components/panel-nav-user'
import { User } from '@/types/user'

export default function PanelLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    // DISABLING THE SIDEBAR TRIGGER WHEN CTRL + B IS PRESSED
    // AND ONLY APPLY TO QUILL EDITOR FOR BOLDING
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeEl = document.activeElement

            // Check if active element is inside a Quill editor
            const isInsideQuillEditor = !!activeEl?.closest('.ql-editor')

            const isStickyNoteOpen = window.__stickyNoteOpen
            console.log('isStickyNoteOpen: ', isStickyNoteOpen)

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

    const themes = [
        { name: 'Light', icon: Sun },
        { name: 'Dark', icon: Moon },
        { name: 'System', icon: MonitorCog },
    ]
    const { data: session } = useSession()
    const user = session?.user

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex items-center justify-between pr-5 h-12 gap-2 border-b">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                    </div>

                    <div className="flex items-center gap-2 ">
                        {/* THEME TOGGLE */}
                        <Popover>
                            <PopoverTrigger>
                                <Sun className="size-5 hover:cursor-pointer" />
                            </PopoverTrigger>
                            <PopoverContent className="w-32 flex flex-col !p-2">
                                <div className="flex flex-col ">
                                    {themes.map((theme, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            className="flex items-center gap-2 text-sm hover:cursor-pointer hover:bg-gray-100 p-1 rounded-md"
                                        >   
                                            <theme.icon className="size-4" />
                                            {theme.name}
                                        </button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {user && <PanelNavUser user={user} />}
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}
