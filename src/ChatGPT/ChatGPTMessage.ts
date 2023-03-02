export interface ChatGPTMessage {
  role: "system" | "user" | "assistant"
  content: string
}
