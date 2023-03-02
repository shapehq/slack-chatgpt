import { NetworkService } from "../NetworkService/NetworkService"

export class SlackClient {
  networkService: NetworkService
  token: string
  
  constructor(networkService: NetworkService, token: string) {
    this.networkService = networkService
    this.token = token
  }
  
  async postMessage(text: string, channel: String, threadTs: string | null): Promise<void> {
    const url = "https://slack.com/api/chat.postMessage"
    const body = {
      text: text,
      channel: channel,
      thread_ts: threadTs
    }
    const headers = {
      "Authorization": "Bearer " + this.token
    }
    const response = await this.networkService.post(url, body, headers)
    if (!response.ok) {
      throw new Error(response.error + ": " + response.response_metadata.messages[0])
    }
  }
}
