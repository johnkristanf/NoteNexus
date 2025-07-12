import { create } from 'zustand'

type ChatStore = {
    initialInput: string
    setInitialInput: (input: string) => void
    clear: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
    initialInput: '',
    setInitialInput: (input) => set({ initialInput: input }),
    clear: () => set({ initialInput: '' }),
}))
