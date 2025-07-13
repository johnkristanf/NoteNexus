export type FetchNotes = {
    id: number
    content: string
    created_at: string
    updated_at: string
}

export type UpdateNote = {
    note_id: number
    updated_content: string
}
