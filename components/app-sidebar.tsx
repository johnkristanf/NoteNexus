'use client'

import { GalleryVerticalEnd, NotebookPen } from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from '@/components/ui/sidebar'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { fetchChats } from '@/lib/api/chats/get'
import { toast } from 'sonner'
import { EditableChatItem } from './editable-chat-item'
import { SearchChat } from './search-chat'
import { useSession } from 'next-auth/react'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession()
    const user = session?.user
    const userID = user?.id

    // FETCH ALL MESSAGES BY CHAT ID
    const {
        data: chats,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['chats', userID],
        queryFn: async ({ queryKey }) => {
            const [, userID] = queryKey // Extract userID from queryKey
            if (!userID) {
                throw new Error('User ID is required')
            }
            return fetchChats(userID as string)
        },
        enabled: !!userID && !!session, // Double check both session and user.id exist
        retry: false,
    })

    if (isError) {
        toast.error(error.message)
        return
    }

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col  leading-none">
                                    <p className="font-medium text-lg">
                                        Note <span className="text-violet-600">Nexus</span>
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        Connect your knowledge.
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {isLoading && !user ? (
                    <div className="flex justify-center text-lg mt-3 text-gray-500 animate-pulse">
                        Loading chats...
                    </div>
                ) : (
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <h1 className="font-medium">Getting Started</h1>
                                </SidebarMenuButton>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <Link href={'/new-chat'}>
                                                <NotebookPen />
                                                New Chat
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>

                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <SearchChat />
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>

                                <SidebarMenuButton asChild>
                                    <h1 className="font-medium">Chats</h1>
                                </SidebarMenuButton>

                                {chats &&
                                    chats.map((chat) => (
                                        <SidebarMenuSub key={chat.id}>
                                            <SidebarMenuSubItem key={chat.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <EditableChatItem
                                                        chat_id={chat.id}
                                                        title={chat.title}
                                                    />
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    ))}
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
