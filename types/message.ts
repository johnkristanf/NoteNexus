export type Message = {
    chat_id: string
    role: string
    content: string
    token_count?: number
}


export type FetchMessage = {
    id: number
    chat_id: string
    role: string
    content: string
}


export type MessagePayload = {
    chat_id: string
    input: string
}
