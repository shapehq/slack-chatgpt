import { NetworkService } from "../NetworkService/NetworkService"

export class SlackClient {
  networkService: NetworkService
  token: string
  
  constructor(networkService: NetworkService, token: string) {
    this.networkService = networkService
    this.token = token
  }
  
  async postMessage(text: string, channel: String, threadTs: string | null): Promise<void> {
    const response = await this.networkService.post("https://slack.com/api/chat.postMessage", {
      text: text,
      channel: channel,
      thread_ts: threadTs
    }, {
      "Authorization": "Bearer " + this.token
    })
    this.processResponse(response)
  }
  
  async openView(triggerId: string, view: any): Promise<void> {
    const response = await this.networkService.post("https://slack.com/api/views.open", {
      trigger_id: triggerId,
      view: view
    }, {
      "Authorization": "Bearer " + this.token
    })
    this.processResponse(response)
  }
  
  async updateView(viewId: string, view: any): Promise<void> {
    const response = await this.networkService.post("https://slack.com/api/views.update", {
      view_id: viewId,
      view: view
    }, {
      "Authorization": "Bearer " + this.token
    })
    this.processResponse(response)
  }
  
  private async processResponse(response: any) {
    if (!response.ok) {
      const metadata = response.response_metadata
      if (metadata.messages != null && metadata.messages.length > 0) {
        throw new Error(response.error + ": " + metadata.messages[0])
      } else {
        throw new Error(response.error)
      }
    }
  }
}
