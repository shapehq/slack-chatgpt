export interface SlackMessage {
  channel: string
  thread_ts?: string
  blocks?: any[]
  text?: string
}