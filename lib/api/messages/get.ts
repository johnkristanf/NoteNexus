import { FetchMessage } from "@/types/message"

export const fetchMessages = async (chat_id: string): Promise<FetchMessage[]> => {
    const res = await fetch(`http://localhost:8000/api/v1/fetch/messages/${chat_id}`)
    if (!res.ok) throw new Error('Failed to get messages')
    return res.json()
}
