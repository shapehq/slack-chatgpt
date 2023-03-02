import { ChatGPTClient } from "../ChatGPT/ChatGPTClient"
import { Env } from "../Env"
import { SlackClient } from "../Slack/SlackClient"

export class SlackEventCallbackHandler {
  chatGPTClient: ChatGPTClient
  slackClient: SlackClient
  
  constructor(chatGPTClient: ChatGPTClient, slackClient: SlackClient) {
    this.chatGPTClient = chatGPTClient
    this.slackClient = slackClient
  }
  
  async handle(event: any) {
    if (event.type == "app_mention") {
      await this.postReply(event.text, event.channel, event.ts)
    } else if (event.type == "message") {
      if (event.bot_profile == null) {
        // Make sure the message was not sent by a bot. If we do not have this check the bot will keep a conversation going with itself.
        await this.postReply(event.text, event.channel, null)
      }
    } else {
      throw new Error("Unexpected Slack event of type " + event.type)
    }
  }
  
  async postReply(prompt: string, channel: string, threadTs: string | null) {
    const chatGPTResponse = await this.chatGPTClient.getResponse([
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": prompt}
    ])
    await this.slackClient.postMessage(chatGPTResponse.content, channel, threadTs)
  }
}