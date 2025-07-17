export async function createNewNote(user_id: string) {
    console.log("user_id: ", user_id);
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/new/note`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,
                content: '',
            }),
        })

        const data = await response.json()
        return data.id
    } catch (error) {
        console.error('Error creating new note:', error)
        throw new Error('Error in creating new note, please try again')
    }
}
