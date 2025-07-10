'use client'

import { startChatStream } from '@/lib/event-source'
import { Link, Mic, Send, Square } from 'lucide-react'
import { useRef, useState } from 'react'

export default function NewChatPage() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<string[]>([])
    const [isStreaming, setIsStreaming] = useState(false)
    const controllerRef = useRef<EventSource | null>(null)

    const sessionId = 'user123'

    const handleSendChat = () => {
        if (!input.trim()) return
        setMessages((prev) => [...prev, `🧑: ${input}`, `🤖: `])
        setIsStreaming(true)

        let streamedText = ''

        controllerRef.current = startChatStream(input, sessionId, (chunk) => {
            streamedText += chunk
            setMessages((prev) =>
                prev.map((msg, i) => (i === prev.length - 1 ? `🤖: ${streamedText}` : msg))
            )
            setIsStreaming(false)
            setInput('')
        })
    }

    const handleStop = () => {
        if (controllerRef.current) {
            controllerRef.current.close()
            setIsStreaming(false)
        }
    }

    return (
        <div className="h-[80vh] flex items-center justify-center ">
            <div className="w-full flex flex-col gap-5">
                {messages.length <= 0 ? (
                    // NOTE NEXUS INTRODUCTION
                    <div className="flex flex-col items-center gap-1">
                        <h1 className="font-bold text-3xl">
                            Hi, I am Note <span className="text-violet-600">Nexus.</span>
                        </h1>
                        <p className="text-lg text-gray-500">How can I help in your studies?</p>
                    </div>
                ) : (
                    // CONVERSATION BOX
                    <div className="border rounded p-4 h-[300px] overflow-y-auto space-y-2 bg-gray-100 text-sm">
                        {messages.map((msg, idx) => (
                            <div key={idx} className="whitespace-pre-wrap">
                                {msg}
                            </div>
                        ))}
                    </div>
                )}

                {/* CHATBOX */}
                <div className="w-full p-2 border-t border-slate-700 bg-slate-800 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Send a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isStreaming}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendChat()
                            }}
                            className="flex-1 bg-slate-800 text-white p-3 rounded-lg focus:outline-none "
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            disabled={isStreaming}
                            className="hover:opacity-75 hover:cursor-pointer text-white px-4 py-2 rounded-lg "
                        >
                            <Link />
                        </button>

                        <div className="flex gap-2">
                            <button
                                disabled={isStreaming}
                                className="hover:opacity-75 hover:cursor-pointer text-white px-4 py-2 rounded-lg "
                            >
                                <Mic />
                            </button>

                            {!isStreaming ? (
                                <button
                                    onClick={handleSendChat}
                                    className="hover:opacity-75 hover:cursor-pointer bg-violet-600 text-white px-4 py-2 rounded"
                                    disabled={isStreaming}
                                >
                                    <Send />
                                </button>
                            ) : (
                                <button
                                    onClick={handleStop}
                                    className="hover:opacity-75 hover:cursor-pointer text-red-500 underline"
                                >
                                    <Square />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
