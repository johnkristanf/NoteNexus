import { FetchChats } from '@/types/chats'

export const fetchChats = async (userID: string): Promise<FetchChats[]> => {
    console.log('userID: ', userID)

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/fetch/chats?user_id=${userID}`
    )
    if (!res.ok) throw new Error('Failed to get chats')
    return res.json()
}
