'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NotebookPen, Search } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchChats } from '@/lib/api/chats/get'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function SearchChat() {
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)

    const { data: session } = useSession()
    const user = session?.user
    const userID = user?.id

    const { data: chats, isLoading } = useQuery({
        queryKey: ['chats', userID],
        queryFn: async () => {
            const chats = await fetchChats(userID as string)
            return chats
        },
        enabled: !!userID && !!session, // Double check both session and user.id exist
        retry: false,
    })

    const filtered = chats?.filter((chat) => chat.title.toLowerCase().includes(query.toLowerCase()))

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full flex items-center gap-2 text-sm  pl-1 hover:bg-violet-50 hover:cursor-pointer  py-1 rounded">
                <Search className="size-5" />
                Search Chat
            </DialogTrigger>

            <DialogContent className="!p-2 sm:max-w-lg font-semibold">
                <DialogTitle />

                <div className="absolute top-0 w-full border-b  py-3">
                    <input
                        autoFocus
                        placeholder="Search by title..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-5 border-none outline-none focus:border-none focus:outline-none focus:ring-0 shadow-none"
                    />
                </div>

                <div className="w-full p-3 rounded-md mt-8 hover:bg-gray-100">
                    <Link href={'/new-chat'} className="flex items-center gap-1 text-sm">
                        <NotebookPen className="size-5" />
                        New Chat
                    </Link>
                </div>

                <ScrollArea className=" max-h-64">
                    {isLoading ? (
                        <div className="text-sm text-gray-500 p-2">Loading...</div>
                    ) : filtered && filtered.length > 0 ? (
                        filtered.map((chat) => (
                            <Link
                                key={chat.id}
                                href={`/chat/${chat.id}`}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-sm text-gray-700"
                            >
                                <MessageCircle className="size-4 text-gray-500" />
                                {chat.title}
                            </Link>
                        ))
                    ) : (
                        <div className="text-sm p-3 text-center text-gray-500">No chats found.</div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
