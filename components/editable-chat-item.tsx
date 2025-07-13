// components/EditableChatItem.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { PenLine, Trash2, EllipsisVertical } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateChat } from '@/lib/api/chats/patch'
import { deleteChat } from '@/lib/api/chats/delete'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { usePathname, useRouter } from 'next/navigation'

interface EditableChat {
    chat_id: string
    title: string
}

export function EditableChatItem({ chat_id, title }: EditableChat) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedTitle, setEditedTitle] = useState(title)
    const queryClient = useQueryClient()
    const inputRef = useRef<HTMLInputElement>(null)

    const router = useRouter()
    const pathname = usePathname()
    const isActive = pathname === `/chat/${chat_id}`

    // UPDATE CHAT MUTATION
    const updateChatMutation = useMutation({
        mutationFn: updateChat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] })
            setIsEditing(false)
        },
    })

    // DELETE CHAT MUTATION
    const deleteChatMutation = useMutation({
        mutationFn: deleteChat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] })
            router.push('/new-chat')
        },
    })

    const handleRename = () => setIsEditing(true)

    const handleSaveRename = async () => {
        if (editedTitle.trim() && editedTitle !== title) {
            updateChatMutation.mutate({
                chat_id: chat_id,
                title: editedTitle,
            })
        }
    }

    const handleDeleteChat = () => {
        deleteChatMutation.mutate({ chat_id })
    }

    const handleKeyDown = async (e: any) => {
        if (e.key === 'Enter') await handleSaveRename()
        if (e.key === 'Escape') {
            setIsEditing(false)
            setEditedTitle(title)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsEditing(false)
                setEditedTitle(title)
            }
        }

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isEditing])

    return (
        <div className="flex items-center justify-between w-full">
            {isEditing ? (
                <input
                    autoFocus
                    ref={inputRef}
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleSaveRename}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border border-violet-600 px-2 py-1 rounded text-sm w-full mr-2 text-gray-800 dark:text-gray-100"
                />
            ) : (
                <Link
                    href={`/chat/${chat_id}`}
                    className={`flex-1 truncate text-sm px-2 py-1 rounded ${
                        isActive ? 'font-medium text-violet-700 dark:text-violet-100' : ''
                    }`}
                >
                    {title}
                </Link>
            )}

            {!isEditing && (
                <Popover>
                    <PopoverTrigger>
                        <EllipsisVertical className="size-5 text-gray-600 hover:cursor-pointer hover:opacity-75 ml-2" />
                    </PopoverTrigger>
                    <PopoverContent className="w-32 flex flex-col !p-2">
                        {/* EDIT CHAT */}
                        <div
                            className="flex items-center gap-2 mb-3 hover:cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                            onClick={handleRename}
                        >
                            <PenLine className="size-5" />
                            <h1 className="text-sm ">Rename</h1>
                        </div>

                        {/* DELETE CHAT */}
                        <AlertDialog>
                            <AlertDialogTrigger>
                                {' '}
                                <div className="flex items-center gap-2 text-red-800 hover:cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                                    <Trash2 className="size-5" />
                                    <h1 className="text-sm">Delete</h1>
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete
                                        your account and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="hover:!cursor-pointer">
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteChat}
                                        className="bg-red-800 hover:!cursor-pointer hover:!opacity-75"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}
