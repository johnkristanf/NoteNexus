export const deleteChat = async ({ chat_id }: { chat_id: string }): Promise<string> => {
    const res = await fetch(`http://localhost:8000/api/v1/chat/${chat_id}`, {
        method: 'DELETE',
    })

    if (!res.ok) throw new Error('Failed to delete chat')
    const data = await res.json()
    console.log('deleted data: ', data)

    return data.message
}
