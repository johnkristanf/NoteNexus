import { FetchChats } from "@/types/chats";

export const fetchChats = async (): Promise<FetchChats[]> => {
    const res = await fetch(`http://localhost:8000/api/v1/fetch/chats`)
    if (!res.ok) throw new Error('Failed to get chats')
    return res.json()
}
