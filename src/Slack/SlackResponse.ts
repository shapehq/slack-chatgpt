export interface SlackResponse {
  delete_original?: boolean
  replace_original?: boolean
  response_type?: "in_channel"
  blocks?: any[]
  text?: string
}