'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNote } from '@/lib/api/notes/patch'
import { toast } from 'sonner'
import debounce from 'lodash.debounce'

interface NoteDialogProps {
    noteID: number
    noteText: string
    isOpen: boolean
    onClose: () => void
}

export default function StickyNoteDialog({ noteID, noteText, isOpen, onClose }: NoteDialogProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()

    // Update editorRef innerHTML when noteText prop changes
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.innerHTML = noteText
                }
            }, 0)
        }
    }, [isOpen])

    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()

        // Manually trigger onInput to update state after command execution
        handleInput()
    }

    // UPDATE NOTE CONTENT MUTATION
    const mutation = useMutation({
        mutationFn: updateNote,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['notes'] })
        },

        onError: (error) => {
            toast.error(error.message)
        },
    })

    const handleUpdateNote = useCallback(() => {
        if (editorRef.current) {
            const updateNoteContent = editorRef.current.innerHTML
            mutation.mutate({ note_id: noteID, updated_content: updateNoteContent })
        }
    }, [mutation, noteID])

    const debouncedUpdateNoteRef = useRef(debounce(handleUpdateNote, 200))

    const handleInput = () => {
        debouncedUpdateNoteRef.current()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault()
            executeCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Note #{noteID}</DialogTitle>
                    <DialogDescription>
                        Use the formatting tools below to style your note.
                    </DialogDescription>
                </DialogHeader>

                {/* Formatting Toolbar */}
                <div className="flex items-center gap-2 p-2 border-b border-gray-200">
                    <button
                        onClick={() => executeCommand('bold')}
                        className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        title="Bold"
                    >
                        <Bold size={16} />
                    </button>

                    <button
                        onClick={() => executeCommand('italic')}
                        className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        title="Italic"
                    >
                        <Italic size={16} />
                    </button>

                    <button
                        onClick={() => executeCommand('underline')}
                        className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        title="Underline"
                    >
                        <Underline size={16} />
                    </button>

                    <button
                        onClick={() => executeCommand('strikeThrough')}
                        className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        title="Strikethrough"
                    >
                        <Strikethrough size={16} />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                    <button
                        onClick={() => executeCommand('insertUnorderedList')}
                        className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        title="Bullet List"
                    >
                        <List size={16} />
                    </button>

                    <button
                        onClick={() => executeCommand('insertOrderedList')}
                        className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        title="Numbered List"
                    >
                        <ListOrdered size={16} />
                    </button>
                </div>

                {/* Rich Text Editor */}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning={true}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    className="min-h-[300px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
                    style={{
                        maxHeight: '400px',
                        direction: 'ltr',
                        textAlign: 'left',
                        unicodeBidi: 'normal',
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}
