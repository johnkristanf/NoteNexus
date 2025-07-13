import { create } from 'zustand'

type ChatStore = {
    initialInput: string
    setInitialInput: (input: string) => void
    clearInitialInput: () => void

    learningMaterialName: string
    uploadedLearningMaterialFile: File | null
    setUploadedLearningMaterialFile: (file: File | null) => void
    setLearningMaterialName: (name: string) => void
    
    clearlearningMaterialName: () => void
    clearUploadedLearningMaterialFile: () => void

}

export const useChatStore = create<ChatStore>((set) => ({
    initialInput: '',
    setInitialInput: (input) => set({ initialInput: input }),
    clearInitialInput: () => set({ initialInput: '' }),

    

    learningMaterialName: '',
    uploadedLearningMaterialFile: null,
    setUploadedLearningMaterialFile: (file) => set({ uploadedLearningMaterialFile: file }),
    setLearningMaterialName: (name) => set({ learningMaterialName: name }),

    clearlearningMaterialName: () => set({ learningMaterialName: '' }),
    clearUploadedLearningMaterialFile: () => set({ uploadedLearningMaterialFile: null }),

}))
