'use client'

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import { cn, dateToTimeFormat } from '@/lib/utils'
import { ArrowRight, Ellipsis, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import StickyNoteDialog from './dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchNotes } from '@/lib/api/notes/get'
import { createNewNote } from '@/lib/api/notes/post'
import StickyNoteOtions from './options'
import { deleteNote } from '@/lib/api/notes/delete'

export default function StickyNotesDrawer() {
    const [hoveredNote, setHoveredNote] = useState<number>()
    const [dbClickedNote, setDbClickedNote] = useState<number>()
    const queryClient = useQueryClient()

    // FETCH ALL NOTES
    const {
        data: notes,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['notes'],
        queryFn: () => fetchNotes(),
    })

    if (isError) {
        toast.error(error.message)
        return
    }

    // ADD NEW NOTE MUTATION
    const addNewNoteMutatation = useMutation({
        mutationFn: createNewNote,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['notes'] })
        },

        onError: (error) => {
            toast.error(error.message)
        },
    })

    const handleAddNewNote = () => {
        addNewNoteMutatation.mutate()
    }

    const handleOpenNote = (noteID: number) => {
        setDbClickedNote(noteID)
    }

    // ADD NEW NOTE MUTATION
    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['notes'] })
        },

        onError: (error) => {
            toast.error(error.message)
        },
    })

    const onDeleteNote = (noteID: number) => {
        deleteNoteMutation.mutate(noteID)
    }

    return (
        <Drawer direction="right">
            <DrawerTrigger className="flex items-center gap-1 text-violet-600 opacity-90 font-semibold hover:cursor-pointer hover:opacity-75">
                Sticky Notes
                <ArrowRight className="size-5" />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Sticky Notes</DrawerTitle>
                    <DrawerDescription>
                        {/* SEARCH STICKY NOTE */}
                        <div className="relative flex items-center  bg-white rounded-md shadow-sm mt-2">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="flex-grow py-2 pl-4 pr-10 rounded-md outline-none text-gray-700 placeholder-gray-500 bg-gray-200 focus:border-none "
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <Search className="h-5 w-5 text-gray-500" />
                            </div>
                        </div>

                        {/* ADD NEW NOTE TRIGGER */}
                        <h1 className="mt-4 mb-2 flex items-center">
                            <Plus
                                className="size-6 hover:opacity-75 hover:cursor-pointer"
                                onClick={handleAddNewNote}
                            />
                        </h1>

                        {/* ACTUAL STICKY NOTES */}
                        <div className="h-[75vh] flex flex-col gap-5 overflow-y-auto">
                            {notes &&
                                notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className={cn(
                                            'h-52 bg-violet-600  text-white relative flex-shrink-0',
                                            hoveredNote === 1 ? 'opacity-75 cursor-pointer' : ''
                                        )}
                                        onMouseEnter={() => setHoveredNote(note.id)}
                                        onMouseLeave={() => setHoveredNote(undefined)}
                                        onDoubleClick={() => setDbClickedNote(note.id)}
                                    >
                                        {/* NOTE OPTION */}
                                        <div className="absolute top-2 right-2 text-xs">
                                            {hoveredNote === note.id ? (
                                                <StickyNoteOtions
                                                    onOpenNote={() => handleOpenNote(note.id)}
                                                    onDeleteNote={() => onDeleteNote(note.id)}
                                                />
                                            ) : (
                                                <h1>{dateToTimeFormat(note.updated_at)}</h1>
                                            )}
                                        </div>

                                        {/* NOTE TEXT */}
                                        <div
                                            className="prose prose-sm max-w-none text-white"
                                            dangerouslySetInnerHTML={{ __html: note.content }}
                                        />

                                        {dbClickedNote === note.id && (
                                            <StickyNoteDialog
                                                noteID={note.id}
                                                noteText={note.content}
                                                isOpen={dbClickedNote === note.id}
                                                onClose={() => setDbClickedNote(undefined)}
                                            />
                                        )}
                                    </div>
                                ))}
                        </div>
                    </DrawerDescription>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    )
}
