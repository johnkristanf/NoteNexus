
export const startChatStream = (
    input: string,
    sessionId: string,
    onChunk: (text: string) => void
) => {
    const params = new URLSearchParams({ input, session_id: sessionId })
    const eventSource = new EventSource(`http://localhost:8000/chat/stream?${params}`)

    eventSource.onmessage = (event) => {
        if (event.data === '[DONE]') {
            eventSource.close()
        } else {
            onChunk(event.data)
        }
    }

    eventSource.onerror = (err) => {
        console.error('Stream error:', err)
        eventSource.close()
    }

    return eventSource
}
