import { create } from 'zustand'
import { FetchNotes } from '@/types/notes'

type NoteStore = {
    note: FetchNotes | null
    isNoteOpen: boolean
    setNote: (note: FetchNotes) => void
    clearNote: () => void
    setNoteOpen: (value: boolean) => void 
}

export const useNoteStore = create<NoteStore>((set) => ({
    note: null,
    isNoteOpen: false,
    setNote: (note) => set({ note }),
    clearNote: () => set({ note: null }),
    setNoteOpen: (value) => set({ isNoteOpen: value }), 
}))
