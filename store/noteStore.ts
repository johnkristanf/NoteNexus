import { create } from 'zustand'
import { FetchNotes } from "@/types/notes"

type NoteStore = {
  note: FetchNotes | null
  setNote: (note: FetchNotes) => void
  clearNote: () => void
}

export const useNoteStore = create<NoteStore>((set) => ({
  note: null,
  setNote: (note) => set({ note }),
  clearNote: () => set({ note: null }),
}))