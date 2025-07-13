import { FetchNotes } from "@/types/notes";

export const fetchNotes = async (): Promise<FetchNotes[]> => {
    const res = await fetch(`http://localhost:8000/api/v1/fetch/notes`)
    if (!res.ok) throw new Error('Failed to fetch notes')
    return res.json()
}
