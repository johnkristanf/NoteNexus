'use client'

import { createNewChat } from '@/lib/api/chats/post'
import { useChatStore } from '@/store/chatStore'
import { Link, Mic, Send, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useQueryClient } from '@tanstack/react-query'

export default function NewChatPage() {
    const [learningMaterialDisplay, setLearningMaterialDisplay] = useState<File | null>(null)
    const [input, setInput] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const router = useRouter()
    const queryClient = useQueryClient()

    const handleCreateNewChat = async () => {
        try {
            const chatID = await createNewChat()
            if (chatID) {
                useChatStore.getState().setInitialInput(input.trim())
                router.push(`/chat/${chatID}`)
                queryClient.invalidateQueries({ queryKey: ['chats'] })
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]

        if (!allowedTypes.includes(file.type)) {
            toast.warning(
                'Only PDF and Word document files are allowed. Please upload a valid file.'
            )
            return
        }

        setLearningMaterialDisplay(file)

        const fileType = file.type || 'unknown'
        const learningMaterialName = `📄 ${file.name} (${fileType.split('/').pop()})`

        useChatStore.getState().setLearningMaterialName(learningMaterialName)
        useChatStore.getState().setUploadedLearningMaterialFile(file)
    }

    const handleRemoveFile = () => {
        setLearningMaterialDisplay(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className="h-[80vh] flex items-center justify-center ">
            <div className="w-full flex flex-col gap-5">
                {/* NOTE NEXUS INTRODUCTION */}
                <div className="flex flex-col items-center gap-1">
                    <h1 className="font-bold text-3xl">
                        Hi, I am Note <span className="text-violet-600">Nexus.</span>
                    </h1>
                    <p className="text-lg text-gray-500">How can I help in your studies?</p>
                </div>

                {/* CHATBOX */}
                <div className="w-full p-2 border-t border-slate-700 bg-slate-800 rounded-2xl">
                    {/* File Badge */}
                    {learningMaterialDisplay ? (
                        <div className="flex items-center gap-2 bg-slate-700 text-white rounded-md px-3 py-2 mb-2 w-fit">
                            📄 {learningMaterialDisplay.name} (
                            {learningMaterialDisplay.type.split('/').pop()})
                            <button onClick={handleRemoveFile} className="ml-2 hover:text-red-400">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Send a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateNewChat()
                                }}
                                className="flex-1 bg-slate-800 text-white p-3 rounded-lg focus:outline-none"
                            />
                        </div>
                    )}

                    <div className="flex justify-between">
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* UPLOAD MATERIAL LINK */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="hover:opacity-75 hover:cursor-pointer text-white px-4 py-2 rounded-lg "
                                >
                                    <Link />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-center">
                                    Upload educational materials only. Uploaded content will <br />
                                    be analyzed to extract key concepts for academic <br />
                                    study and learning enhancement.
                                </p>
                            </TooltipContent>
                        </Tooltip>

                        <div className="flex gap-2">
                            <button className="hover:opacity-75 hover:cursor-pointer text-white px-4 py-2 rounded-lg ">
                                <Mic />
                            </button>

                            <button
                                onClick={handleCreateNewChat}
                                className="hover:opacity-75 hover:cursor-pointer bg-violet-600 text-white px-4 py-2 rounded"
                            >
                                <Send />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
