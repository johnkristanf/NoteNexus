'use client'

import { useParams } from 'next/navigation'
import { Link, Mic, Send, Square, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGFM from 'remark-gfm'
import { useChatStore } from '@/store/chatStore'
import { Message, MessagePayload } from '@/types/message'
import { createNewMessage, sendLLMMessage, uploadLearningMaterials } from '@/lib/api/messages/post'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { fetchMessages } from '@/lib/api/messages/get'
import { DotLoader } from '@/components/dot-loader'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import StickyNotesDrawer from '@/components/sticky-notes/drawer'
import StickyNoteDraggable from '@/components/sticky-notes/draggable'
import { useNoteStore } from '@/store/noteStore'

export default function DynamicPage() {
    const [learningMaterialDisplay, setLearningMaterialDisplay] = useState<File | null>(null)
    const [input, setInput] = useState<string>('')
    const hasSentInitial = useRef<boolean>(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const endOfMessagesRef = useRef<HTMLDivElement | null>(null)
    const [stateMessages, setStateMessages] = useState<Message[]>([])
    const [isStreaming, setIsStreaming] = useState(false)
    const eventSourceControllerRef = useRef<EventSource | null>(null)

    const { note, clearNote } = useNoteStore()

    // CHAT PARAMETERS
    const params = useParams()
    const chatID = params.chat_id as string

    // FETCH ALL MESSAGES BY CHAT ID
    const {
        data: messages,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['users', chatID],
        queryFn: () => fetchMessages(chatID),
    })

    // FETCH MESSAGE ERROR HANDLING
    if (isError) {
        toast.error(error.message)
        return
    }

    const handleSendChat = async (initialInput?: string) => {
        const message = initialInput ?? input

        // IF NO MESSAGE STRING PROVIDED, MEANS UPLOAD MATERIAL
        if (!message.trim()) {
            const learningMaterialName = useChatStore.getState().learningMaterialName
            const uploadedLearningMaterialFile =
                useChatStore.getState().uploadedLearningMaterialFile

            if (uploadedLearningMaterialFile && learningMaterialName.trim()) {
                handleUploadLearningMaterial(learningMaterialName, uploadedLearningMaterialFile)
                setLearningMaterialDisplay(null)
                return
            }
        }

        setInput('')
        setIsStreaming(true)

        const userMessage: Message = {
            chat_id: chatID,
            role: 'user',
            content: message,
            token_count: 0,
        }
        setStateMessages((prev) => [...prev, userMessage])

        // SET STATE MESSAGE FOR USER ROLE

        const messagePayload: MessagePayload = {
            chat_id: chatID,
            input: message,
        }

        try {
            const contentResponse = await sendLLMMessage(messagePayload)

            if (contentResponse) {
                const assistantMessage: Message = {
                    chat_id: chatID,
                    role: 'assistant',
                    content: contentResponse,
                    token_count: 0,
                }

                // SET STATE MESSAGE FOR ASSISTANT ROLE
                setStateMessages((prev) => {
                    const copy = [...prev]
                    if (copy.length && copy[copy.length - 1].role === 'assistant') {
                        copy[copy.length - 1] = { ...assistantMessage }
                    } else {
                        copy.push({ ...assistantMessage })
                    }
                    return copy
                })
                setIsStreaming(false)

                // SAVE MESSAGE FOR THE USER
                await createNewMessage(userMessage)

                // SAVE MESSAGE FOR THE ASSISTANT
                await createNewMessage(assistantMessage)
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
        }
    }

    const handleUploadLearningMaterial = async (
        learningMaterialName: string,
        learningMaterialFile: File
    ) => {
        try {
            const userMessage: Message = {
                chat_id: chatID,
                role: 'user',
                content: learningMaterialName,
                token_count: 0,
            }
            setStateMessages((prev) => [...prev, userMessage])
            setIsStreaming(true)

            const contentResponse = await uploadLearningMaterials(chatID, learningMaterialFile)

            if (contentResponse) {
                const assistantMessage: Message = {
                    chat_id: chatID,
                    role: 'assistant',
                    content: contentResponse,
                    token_count: 0,
                }

                // SET STATE MESSAGE FOR ASSISTANT ROLE
                setStateMessages((prev) => {
                    const copy = [...prev]
                    if (copy.length && copy[copy.length - 1].role === 'assistant') {
                        copy[copy.length - 1] = { ...assistantMessage }
                    } else {
                        copy.push({ ...assistantMessage })
                    }
                    return copy
                })
                setIsStreaming(false)

                // SAVE MESSAGE FOR THE USER
                await createNewMessage(userMessage)

                // SAVE MESSAGE FOR THE ASSISTANT
                await createNewMessage(assistantMessage)
            }

            // HANDLE THE NEW MESSAGE INSERTION FOR ASSISTANT
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
        }
    }

    // EVENT STEAM STOP
    const handleStop = () => {
        if (eventSourceControllerRef.current) {
            eventSourceControllerRef.current.close()
            setIsStreaming(false)
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

    // USEEFFECT THAT HANDLES THE SENDING OF CHAT RIGHT AFTER INPUTTING IN THE
    // NEW-CHAT PAGE
    useEffect(() => {
        const storedInitialInput = useChatStore.getState().initialInput

        const uploadedLearningMaterialFile = useChatStore.getState().uploadedLearningMaterialFile
        const learningMaterialName = useChatStore.getState().learningMaterialName

        if (storedInitialInput && !hasSentInitial.current) {
            handleSendChat(storedInitialInput)
            useChatStore.getState().clearInitialInput()

            // AVOID RE-SEND MESSAGE
            hasSentInitial.current = true
        } else if (uploadedLearningMaterialFile && !hasSentInitial.current) {
            handleUploadLearningMaterial(learningMaterialName, uploadedLearningMaterialFile)

            // CLEAR UPLOAD RELATED DATA
            useChatStore.getState().clearlearningMaterialName()
            useChatStore.getState().clearUploadedLearningMaterialFile()

            // AVOID RE-UPLOAD
            hasSentInitial.current = true
        }
    }, [chatID])

    // USEEFFECT THAT HANDLES THE AUTO BOTTOM SCROLL UPON RENDER
    useEffect(() => {
        if (!isStreaming) {
            endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, stateMessages])

    // FILTER THE (message and stateMessage) MESSAGE TO AVOID UNEXPECTED DUPLICATION UPON RENDER
    const combinedMessages = useMemo(() => {
        const seen = new Set()
        return [...(messages ?? []), ...stateMessages].filter((msg) => {
            const key = `${msg.role}-${msg.content}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })
    }, [messages, stateMessages])

    return (
        <div className="h-[100vh] flex justify-center max-w-full ">
            <div className="w-full flex flex-col gap-5">
                {/* MESSAGES LOADER */}
                {(isLoading && !isStreaming) && (
                    <div className="flex justify-center py-4 text-xl text-gray-500 animate-pulse">
                        Loading messages...
                    </div>
                )}

                {/* STICKY NOTE DRAWER TRIGGER */}
                {!isLoading && (
                    <div className="w-full flex justify-end">
                        <StickyNotesDrawer />
                    </div>
                )}

                {/* DRAGGABLE STICKY NOTE */}
                {note && (
                    <StickyNoteDraggable
                        noteID={note.id}
                        noteText={note.content}
                        isOpen={note !== null}
                        onClose={clearNote}
                    />
                )}

                {/* CONVERSATION BOX */}
                <div className="h-[80vh] overflow-y-auto p-3 space-y-2 rounded-lg max-w-full relative">
                    {combinedMessages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${
                                msg.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`max-w-[70%] min-w-0 rounded-lg p-3 break-words overflow-wrap-anywhere ${
                                    msg.role === 'user'
                                        ? 'bg-violet-600 text-white rounded-br-none'
                                        : 'bg-slate-800 text-gray-100 rounded-bl-none'
                                }`}
                            >
                                <Markdown
                                    remarkPlugins={[remarkGFM]}
                                    components={{
                                        // Text elements - ADD PROPER WORD WRAPPING
                                        p: ({ children }) => (
                                            <p className="mb-4 leading-relaxed text-gray-100 dark:text-gray-100 break-words">
                                                {children}
                                            </p>
                                        ),

                                        // Headings with proper hierarchy
                                        h1: ({ children }) => (
                                            <h1 className="text-3xl font-bold text-white dark:text-white mb-6 mt-8 pb-5 border-b border-gray-200 dark:border-gray-700 break-words">
                                                {children}
                                            </h1>
                                        ),
                                        h2: ({ children }) => (
                                            <h2 className="text-2xl font-semibold text-white dark:text-white mb-4 mt-7 pb-4 border-b border-gray-100 dark:border-gray-800 break-words">
                                                {children}
                                            </h2>
                                        ),
                                        h3: ({ children }) => (
                                            <h3 className="text-xl font-semibold text-white dark:text-white mb-3 mt-6 break-words">
                                                {children}
                                            </h3>
                                        ),
                                        h4: ({ children }) => (
                                            <h4 className="text-lg font-medium text-white dark:text-white mb-2 mt-5 break-words">
                                                {children}
                                            </h4>
                                        ),
                                        h5: ({ children }) => (
                                            <h5 className="text-base font-medium text-white dark:text-white mb-2 mt-4 break-words">
                                                {children}
                                            </h5>
                                        ),
                                        h6: ({ children }) => (
                                            <h6 className="text-sm font-medium text-gray-100 dark:text-gray-100 mb-2 mt-3 uppercase tracking-wide break-words">
                                                {children}
                                            </h6>
                                        ),

                                        // Text formatting
                                        strong: ({ children }) => (
                                            <strong className="font-bold text-violet-600 dark:text-violet-400">
                                                {children}
                                            </strong>
                                        ),
                                        em: ({ children }) => (
                                            <em className="italic text-gray-100 dark:text-gray-100">
                                                {children}
                                            </em>
                                        ),

                                        // Code elements - ADD PROPER OVERFLOW HANDLING
                                        code: ({ inline, className, children }) => {
                                            const language =
                                                className?.replace('language-', '') || ''

                                            if (inline) {
                                                return (
                                                    <code className="bg-gray-100 dark:bg-gray-800 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded text-sm font-mono border break-all">
                                                        {children}
                                                    </code>
                                                )
                                            }

                                            return (
                                                <div className="mb-4 rounded-lg overflow-hidden max-w-full">
                                                    {language && (
                                                        <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 border-b">
                                                            {language}
                                                        </div>
                                                    )}
                                                    <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 overflow-x-auto max-w-full">
                                                        <code className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
                                                            {children}
                                                        </code>
                                                    </pre>
                                                </div>
                                            )
                                        },

                                        // FIXED LISTS - Increased spacing and proper styling
                                        ul: ({ children }) => (
                                            <ul className="mb-6 ml-6 space-y-3 list-disc marker:text-violet-600 dark:marker:text-violet-400">
                                                {children}
                                            </ul>
                                        ),
                                        ol: ({ children }) => (
                                            <ol className="mb-6 ml-6 space-y-3 list-decimal marker:text-violet-600 dark:marker:text-violet-400 marker:font-semibold">
                                                {children}
                                            </ol>
                                        ),
                                        li: ({ children }) => (
                                            <li className="text-gray-100 dark:text-gray-100 leading-relaxed pl-2 break-words">
                                                <div className="py-1">{children}</div>
                                            </li>
                                        ),

                                        // Tables - ADD PROPER RESPONSIVE HANDLING
                                        table: ({ children }) => (
                                            <div className="mb-6 overflow-x-auto max-w-full">
                                                <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                    {children}
                                                </table>
                                            </div>
                                        ),
                                        thead: ({ children }) => (
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                {children}
                                            </thead>
                                        ),
                                        tbody: ({ children }) => (
                                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                {children}
                                            </tbody>
                                        ),
                                        tr: ({ children }) => (
                                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                {children}
                                            </tr>
                                        ),
                                        th: ({ children }) => (
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-100 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 break-words">
                                                {children}
                                            </th>
                                        ),
                                        td: ({ children }) => (
                                            <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 break-words">
                                                {children}
                                            </td>
                                        ),

                                        // Blockquotes
                                        blockquote: ({ children }) => (
                                            <blockquote className="border-l-4 border-violet-600 dark:border-violet-400 pl-4 py-2 mb-4 bg-gray-50 dark:bg-gray-800 rounded-r-lg break-words">
                                                <div className="italic text-gray-100 dark:text-gray-100">
                                                    {children}
                                                </div>
                                            </blockquote>
                                        ),

                                        // Links - ADD WORD BREAKING
                                        a: ({ href, children }) => (
                                            <a
                                                href={href}
                                                className="text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 underline underline-offset-2 transition-colors break-all"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {children}
                                            </a>
                                        ),

                                        // Images - ENSURE RESPONSIVE
                                        img: ({ src, alt, title }) => (
                                            <div className="mb-4">
                                                <img
                                                    src={src}
                                                    alt={alt}
                                                    title={title}
                                                    className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                                                    loading="lazy"
                                                />
                                                {alt && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic break-words">
                                                        {alt}
                                                    </p>
                                                )}
                                            </div>
                                        ),

                                        // Horizontal rule
                                        hr: () => (
                                            <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                                        ),

                                        // Task lists (checkboxes)
                                        input: ({ type, checked, disabled }) => {
                                            if (type === 'checkbox') {
                                                return (
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        disabled={disabled}
                                                        className="mr-2 h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                                                    />
                                                )
                                            }
                                            return null
                                        },

                                        // Delete/strikethrough
                                        del: ({ children }) => (
                                            <del className="line-through text-gray-500 dark:text-gray-400">
                                                {children}
                                            </del>
                                        ),

                                        // Custom components for enhanced styling
                                        div: ({ className, children }) => {
                                            if (className?.includes('callout')) {
                                                const calloutType =
                                                    className.match(/callout-(\w+)/)?.[1] || 'info'
                                                const calloutStyles = {
                                                    info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
                                                    warning:
                                                        'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
                                                    error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
                                                    success:
                                                        'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
                                                }

                                                return (
                                                    <div
                                                        className={`p-4 mb-4 rounded-lg border-l-4 break-words ${
                                                            calloutStyles[calloutType] ||
                                                            calloutStyles.info
                                                        }`}
                                                    >
                                                        {children}
                                                    </div>
                                                )
                                            }

                                            return <div className={className}>{children}</div>
                                        },

                                        // Keyboard keys
                                        kbd: ({ children }) => (
                                            <kbd className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono shadow-sm">
                                                {children}
                                            </kbd>
                                        ),

                                        // Subscript and superscript
                                        sub: ({ children }) => (
                                            <sub className="text-xs">{children}</sub>
                                        ),
                                        sup: ({ children }) => (
                                            <sup className="text-xs">{children}</sup>
                                        ),

                                        // Details/Summary (collapsible content)
                                        details: ({ children }) => (
                                            <details className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-full">
                                                {children}
                                            </details>
                                        ),
                                        summary: ({ children }) => (
                                            <summary className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg font-medium text-gray-100 dark:text-gray-100 break-words">
                                                {children}
                                            </summary>
                                        ),
                                    }}
                                >
                                    {msg.content}
                                </Markdown>
                            </div>
                        </div>
                    ))}

                    {/* Assistant Typing Loader */}
                    {isStreaming && (
                        <div className="flex justify-start">
                            <div className="max-w-[70%] min-w-0 rounded-lg p-3 bg-slate-800 text-gray-100 rounded-bl-none">
                                <DotLoader />
                            </div>
                        </div>
                    )}

                    {/* 👇 Auto-scroll anchor */}
                    <div ref={endOfMessagesRef} className="h-0" />
                </div>

                {/* CHATBOX */}
                {!isLoading && (
                    <div className="w-full  p-2 border-t border-slate-700 bg-slate-800 rounded-2xl">
                        {/* File Badge */}
                        {learningMaterialDisplay ? (
                            <div className="flex items-center gap-2 bg-slate-700 text-white rounded-md px-3 py-2 mb-2 w-fit">
                                📄 {learningMaterialDisplay.name} (
                                {learningMaterialDisplay.type.split('/').pop()})
                                <button
                                    onClick={handleRemoveFile}
                                    className="ml-2 hover:text-red-400"
                                >
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
                                    disabled={isStreaming}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSendChat()
                                    }}
                                    className="flex-1 bg-slate-800 text-white p-2 rounded-lg focus:outline-none "
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
                                        className="hover:opacity-75 hover:cursor-pointer text-white px-2 py-2 rounded-lg "
                                    >
                                        <Link className="size-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-center">
                                        Upload educational materials only. Uploaded content will{' '}
                                        <br />
                                        be analyzed to extract key concepts for academic <br />
                                        study and learning enhancement.
                                    </p>
                                </TooltipContent>
                            </Tooltip>

                            <div className="flex gap-4">
                                <button
                                    disabled={isStreaming}
                                    className="hover:opacity-75 hover:cursor-pointer text-white py-2 rounded-lg "
                                >
                                    <Mic className="size-5" />
                                </button>

                                {!isStreaming ? (
                                    <button
                                        onClick={() => handleSendChat()}
                                        className="hover:opacity-75 hover:cursor-pointer bg-violet-600 text-white px-4 py-2 rounded"
                                        disabled={isStreaming}
                                    >
                                        <Send className="size-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleStop}
                                        className="hover:opacity-75 hover:cursor-pointer text-red-500 underline"
                                    >
                                        <Square className="size-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
