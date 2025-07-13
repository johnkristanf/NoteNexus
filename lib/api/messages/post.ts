import { Message, MessagePayload } from '@/types/message'

export async function createNewMessage(message: Message) {
    try {
        const response = await fetch('http://localhost:8000/api/v1/new/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })

        if (!response.ok) {
            throw new Error(`Failed to create chat: ${response.status}`)
        }

        const data = await response.json()
        return data.id
    } catch (error) {
        console.error('Error creating message:', error)
        throw new Error('Unexpected error occured. Please try again')
    }
}

export async function sendLLMMessage(payload: MessagePayload) {
    try {
        const response = await fetch('http://localhost:8000/api/v1/send/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error(`Failed to create chat: ${response.status}`)
        }

        const data = await response.json()
        return data.content
    } catch (error) {
        console.error('Error sending chat:', error)
        throw new Error('Unexpected error occured. Please try again')
    }
}

export async function uploadLearningMaterials(chat_id: string, learningMaterial: File) {
    try {
        const formData = new FormData()
        formData.append('chat_id', chat_id) // Must match the FastAPI parameter name
        formData.append('learningMaterial', learningMaterial) // Must match the FastAPI parameter name

        const response = await fetch('http://localhost:8000/api/v1/upload/learning/material', {
            method: 'POST',
            body: formData,
        })

        const data = await response.json()
        return data.content
    } catch (error) {
        console.error('Upload failed:', error)
        throw new Error('Error uploading learning material. Please try again')
    }
}
