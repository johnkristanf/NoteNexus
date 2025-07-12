export const startChatStream = (
    input: string,
    chatID: string,
    onChunk: (text: string, isStreamingDone: boolean, isStreamingError: boolean) => void
) => {
    const params = new URLSearchParams({ input, chat_id: chatID })
    const eventSource = new EventSource(`http://localhost:8000/api/v1/chat/stream?${params}`)

    eventSource.onmessage = (event) => {
        if (event.data === '[DONE]') {
            onChunk('', true, false)
            eventSource.close()
            return
        } else {
            onChunk(event.data, false, false)
        }
    }

    eventSource.onerror = (err) => {
        console.error('Stream error:', err)
        onChunk('', false, true)
        eventSource.close()
    }

    return eventSource
}
