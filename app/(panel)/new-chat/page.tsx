'use client'

import { createNewChat } from '@/lib/api/chats/post'
import { useChatStore } from '@/store/chatStore'
import { Link, Mic, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function NewChatPage() {
    const [input, setInput] = useState('')
    const router = useRouter()

    const handleCreateNewChat = async () => {
        try {
            const chatID = await createNewChat()
            if (chatID) {
                useChatStore.getState().setInitialInput(input.trim())
                router.push(`/chat/${chatID}`)
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
        }
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

                    <div className="flex justify-between">
                        <button className="hover:opacity-75 hover:cursor-pointer text-white px-4 py-2 rounded-lg ">
                            <Link />
                        </button>

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
