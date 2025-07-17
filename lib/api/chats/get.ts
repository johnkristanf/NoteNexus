import { FetchChats } from "@/types/chats";

export const fetchChats = async (): Promise<FetchChats[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/fetch/chats`)
    if (!res.ok) throw new Error('Failed to get chats')
    return res.json()
}
