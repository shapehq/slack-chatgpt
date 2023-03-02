import { ChatGPTClient } from "./ChatGPT/ChatGPTClient"
import { SlackClient } from "./Slack/SlackClient"
import { SlackModalView } from "./Slack/SlackModalView"

export class Bot {
  chatGPTClient: ChatGPTClient
  slackClient: SlackClient
  
  constructor(chatGPTClient: ChatGPTClient, slackClient: SlackClient) {
    this.chatGPTClient = chatGPTClient
    this.slackClient = slackClient
  }
  
  async postReply(prompt: string, channel: string, threadTs: string | null) {
    const chatGPTResponse = await this.chatGPTClient.getResponse(prompt)
    await this.slackClient.postMessage(chatGPTResponse.content, channel, threadTs)
  }
  
  async openPromptView(triggerId: string) {
    await this.slackClient.openView(triggerId, SlackModalView.prompt())
  }
  
  async updatePromptView(viewId: string, prompt: string) {
    const chatGPTResponse = await this.chatGPTClient.getResponse(prompt)
    await this.slackClient.updateView(viewId, SlackModalView.prompt(chatGPTResponse.content))
  }
}
