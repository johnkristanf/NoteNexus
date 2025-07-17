import { FetchNotes } from "@/types/notes";

export const fetchNotes = async (): Promise<FetchNotes[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/fetch/notes`)
    if (!res.ok) throw new Error('Failed to fetch notes')
    return res.json()
}
