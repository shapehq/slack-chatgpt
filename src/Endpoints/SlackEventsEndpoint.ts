import { ChatGPTClient } from "../ChatGPTClient"
import { Endpoint } from "./Endpoint"
import { readRequestBody } from "../readRequestBody"
import { ResponseFactory } from "../ResponseFactory"
import { SlackClient } from "../Slack/SlackClient"
import { SlackEventType } from "../Slack/SlackEventType"
import { SlackLoadingMessage } from "../Slack/SlackLoadingMessage"

export class SlackEventsEndpoint implements Endpoint {
  chatGPTClient: ChatGPTClient
  slackClient: SlackClient
  
  constructor(chatGPTClient: ChatGPTClient, slackClient: SlackClient) {
    this.chatGPTClient = chatGPTClient
    this.slackClient = slackClient
  }
  
  async fetch(request: Request, ctx: ExecutionContext): Promise<Response> {
    if (request.method == "POST") {
      return await this.handlePostRequest(request, ctx)
    } else {
      return ResponseFactory.badRequest("Unsupported HTTP method: " + request.method)
    }
  }
  
  private async handlePostRequest(request: Request, ctx: ExecutionContext): Promise<Response> {
    const body = await readRequestBody(request)
    if (body.type == SlackEventType.URL_VERIFICATION) {
      return new Response(body.challenge)
    } else if (body.type == SlackEventType.EVENT_CALLBACK) {
      // Make sure the message was not sent by a bot. If we do not have this check the bot will keep a conversation going with itself.
      const event = body.event
      if (!this.isEventFromBot(event)) {
        await this.postEphemeralLoadingMessage(event.type, event.user, event.channel, event.thread_ts)
        const answerPromise = this.postAnswer(event.type, event.channel, event.ts, event.text)
        ctx.waitUntil(answerPromise)
        return new Response()
      } else {
        return new Response()
      }
    } else {
      return new Response("Unsupported request from from Slack of type " + body.type, {
        status: 400, 
        statusText: "Bad Request"
      })
    }
  }
  
  private async postEphemeralLoadingMessage(eventType: any, user: string, channel: string, threadTs: string | null) {
    const message: any = {
      text: SlackLoadingMessage.getRandom(),
      channel: channel,
      user: user
    }
    if (eventType == SlackEventType.APP_MENTION) {
      message.thread_ts = threadTs
    }
    await this.slackClient.postEphemeralMessage(message)
  }
  
  private async postAnswer(eventType: any, channel: string, threadTs: string, prompt: string) {
    const answer = await this.chatGPTClient.getResponse(prompt)
    const message: any = {
      text: answer,
      channel: channel
    }
    if (eventType == SlackEventType.APP_MENTION) {
      message.thread_ts = threadTs
    }
    await this.slackClient.postMessage(message)
  }
  
  private isEventFromBot(event: any): boolean {
    return event.bot_profile != null
  }
}
