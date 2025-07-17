export const updateChat = async ({
    chat_id,
    title,
}: {
    chat_id: string
    title: string
}): Promise<string> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/${chat_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        })

        const data = await res.json()
        return data.updated_chat_id
    } catch (error) {
        console.error('Error in updating chat: ', error)
        throw new Error('Error in updating chat. Please try again')
    }
}
