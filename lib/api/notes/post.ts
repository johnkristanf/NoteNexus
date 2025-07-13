export async function createNewNote() {
    try {
        const response = await fetch('http://localhost:8000/api/v1/new/note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: '',
            }),
        })

        const data = await response.json()
        return data.id;

    } catch (error) {
        console.error('Error creating new note:', error)
        throw new Error('Error in creating new note, please try again')
    }
}
