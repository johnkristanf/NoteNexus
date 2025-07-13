import { UpdateNote } from '@/types/notes'

export const updateNote = async ({ note_id, updated_content }: UpdateNote): Promise<number> => {
    try {
        const res = await fetch(`http://localhost:8000/api/v1/note/${note_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ updated_content }),
        })

        const data = await res.json()
        return data.updated_note_id
    } catch (error) {
        console.error('Error in updating note: ', error)
        throw new Error('Error in updating note. Please try again')
    }
}
