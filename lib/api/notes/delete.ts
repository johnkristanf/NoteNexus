export const deleteNote = async (noteID: number): Promise<number> => {
    try {
        const res = await fetch(`http://localhost:8000/api/v1/note/${noteID}`, {
            method: 'DELETE',
        })

        const data = await res.json()
        return data.deleted_note_id
    } catch (error) {
        console.error('Error in deleting note: ', error)
        throw new Error('Error in deleting note. Please try again')
    }
}
