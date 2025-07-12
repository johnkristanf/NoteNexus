export const updateChat = async ({
    chat_id,
    title,
}: {
    chat_id: string
    title: string
}): Promise<string> => {
    const res = await fetch(`http://localhost:8000/api/v1/chat/${chat_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    })

    if (!res.ok) throw new Error('Failed to update chat')
    const data = await res.json()
    console.log('update data: ', data)

    return data.updated_chat_id
}

