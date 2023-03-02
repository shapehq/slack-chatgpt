import { ChatGPTClient } from "./ChatGPT/ChatGPTClient"
import { SlackClient } from "./SlackClient"

export class Bot {
  chatGPTClient: ChatGPTClient
  slackClient: SlackClient
  
  constructor(chatGPTClient: ChatGPTClient, slackClient: SlackClient) {
    this.chatGPTClient = chatGPTClient
    this.slackClient = slackClient
  }
  
  async postReply(prompt: string, channel: string, threadTs: string | null) {
    const chatGPTResponse = await this.chatGPTClient.getResponse([
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": prompt}
    ])
    await this.slackClient.postMessage(chatGPTResponse.content, channel, threadTs)
  }
}