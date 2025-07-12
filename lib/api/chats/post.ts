export async function createNewChat() {
    try {
        const response = await fetch('http://localhost:8000/api/v1/new/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: 'Untitled', // optional — or leave as null
            }),
        })

        if (!response.ok) {
            throw new Error(`Failed to create chat: ${response.status}`)
        }

        const data = await response.json()
        return data.id;

    } catch (error) {
        console.error('Error creating chat:', error)
        throw new Error('Error in creating new chat, please try again')
    }
}
