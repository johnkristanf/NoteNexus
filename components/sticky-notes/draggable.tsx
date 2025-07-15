'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Move } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNote } from '@/lib/api/notes/patch'
import { toast } from 'sonner'
import { Rnd } from 'react-rnd'

import debounce from 'lodash.debounce'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

interface NoteDialogProps {
    noteID: number
    noteText: string
    isOpen: boolean
    onClose: () => void
}

export default function StickyNoteDraggable({
    noteID,
    noteText,
    isOpen,
    onClose,
}: NoteDialogProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<Quill | null>(null)
    const queryClient = useQueryClient()

    // UPDATE NOTE MUTATION
    const mutation = useMutation({
        mutationFn: updateNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] })
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    // CALLBACK FOR UPDATE NOTE HANDLER
    const handleUpdateNote = useCallback(() => {
        if (editorRef.current && quillRef.current) {
            const updateNoteContent = quillRef.current.root.innerHTML
            mutation.mutate({ note_id: noteID, updated_content: updateNoteContent })
        }
    }, [mutation, noteID])

    const debouncedUpdateNoteRef = useRef(debounce(handleUpdateNote, 200))

    // Initialize Quill
    useEffect(() => {
        if (!isOpen) return

        const waitForEditor = () => {
            if (!editorRef.current) {
                requestAnimationFrame(waitForEditor)
                return
            }

            const quill = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: false,
                },
                placeholder: 'Start typing...',
            })

            quill.root.style.height = '100%'
            quill.root.style.boxSizing = 'border-box'

            // INJECT DEFAULT NOTE CONTENT INSIDE THE RICH EDITOR
            if (noteText) {
                quill.clipboard.dangerouslyPasteHTML(noteText)
            }

            // DEBOUNCE IF THERE IS CHANGES IN EDITOR
            quill.on('text-change', () => {
                debouncedUpdateNoteRef.current()
            })

            quillRef.current = quill
        }

        requestAnimationFrame(waitForEditor)

        return () => {
            if (quillRef.current) {
                quillRef.current.off('text-change')
                quillRef.current = null
            }
            if (editorRef.current) {
                editorRef.current.innerHTML = ''
            }
        }
    }, [isOpen])

    // APPLY TOOLBARS FORMAT (BOLD, ITALIC, UNDERLINE, etc..)
    const applyFormat = (format: string, value: any = true) => {
        const quill = quillRef.current
        if (!quill) return

        const range = quill.getSelection()
        if (range) {
            const currentFormat = quill.getFormat(range)
            const isActive = currentFormat[format] === value
            quill.format(format, isActive ? false : value)
        }
    }

    // SETTING GLOBAL STATE BOOLEAN VALUE IF NOTE DRAGGABLE IS OPEN
    // AVOIDING SIDEBAR GETTING TOGGLED ON KEY CTRL + B
    useEffect(() => {
        if (isOpen) {
            window.__stickyNoteOpen = true
        } else {
            window.__stickyNoteOpen = false
        }

        return () => {
            window.__stickyNoteOpen = false
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <Rnd
            default={{
                x: 100,
                y: 100,
                width: 600,
                height: 400,
            }}
            style={{
                zIndex: 99999,
                background: 'white',
                color: 'black',
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                overflow: 'hidden', // This ensures internal elements are clipped and clean
            }}
            minWidth={300}
            minHeight={200}
            bounds="window"
            // SELECT ELEMENT ALLOWED TO DRAG
            dragHandleClassName="draggable-handle"
        >
            {/* Draggable Header */}
            <div
                className="draggable-handle cursor-move bg-violet-500 text-white px-4 py-2 rounded-t-md flex justify-between items-center"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                }}
            >
                <span>Edit Note #{noteID}</span>
                <button onClick={onClose} className="hover:opacity-80">
                    ×
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
                <button onClick={() => applyFormat('bold')} title="Bold" className="p-1">
                    <Bold size={16} />
                </button>
                <button onClick={() => applyFormat('italic')} title="Italic" className="p-1">
                    <Italic size={16} />
                </button>
                <button onClick={() => applyFormat('underline')} title="Underline" className="p-1">
                    <Underline size={16} />
                </button>
                <button onClick={() => applyFormat('strike')} title="Strikethrough" className="p-1">
                    <Strikethrough size={16} />
                </button>
                <div className="w-px h-4 bg-gray-400 mx-2" />
                <button
                    onClick={() => applyFormat('list', 'bullet')}
                    title="Bullet List"
                    className="p-1"
                >
                    <List size={16} />
                </button>
                <button
                    onClick={() => applyFormat('list', 'ordered')}
                    title="Numbered List"
                    className="p-1"
                >
                    <ListOrdered size={16} />
                </button>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                className="flex-1 overflow-y-auto focus:outline-none "
                style={{
                    padding: '1rem',
                    height: '100%',
                }}
            />
        </Rnd>
    )
}
