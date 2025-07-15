export async function createNewChat(user_id: string) {
    try {
        const response = await fetch('http://localhost:8000/api/v1/new/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,
                title: 'Untitled',
            }),
        })

        const data = await response.json()
        return data.id
    } catch (error) {
        console.error('Error creating chat:', error)
        throw new Error('Error in creating new chat, please try again')
    }
}
