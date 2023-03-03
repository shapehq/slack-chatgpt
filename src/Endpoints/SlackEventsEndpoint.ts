import { ChatGPTClient } from "../ChatGPTClient"
import { Endpoint } from "./Endpoint"
import { readRequestBody } from "../readRequestBody"
import { ResponseFactory } from "../ResponseFactory"
import { SlackClient } from "../Slack/SlackClient"
import { SlackEventType } from "../Slack/SlackEventType"

export class SlackEventsEndpoint implements Endpoint {
  chatGPTClient: ChatGPTClient
  slackClient: SlackClient
  
  constructor(chatGPTClient: ChatGPTClient, slackClient: SlackClient) {
    this.chatGPTClient = chatGPTClient
    this.slackClient = slackClient
  }
  
  async fetch(request: Request, ctx: ExecutionContext): Promise<Response> {
   if (request.method == "POST") {
     return await this.handlePostRequest(request)
   } else {
     return ResponseFactory.badRequest("Unsupported HTTP method: " + request.method)
   }
  }
  
  private async handlePostRequest(request: Request): Promise<Response> {
    const body = await readRequestBody(request)
    console.log(JSON.stringify(body, null, 2))
    if (body.type == SlackEventType.URL_VERIFICATION) {
     return new Response(body.challenge)
   } else if (body.type == SlackEventType.EVENT_CALLBACK) {
     await this.handleEventCallback(body.event)
     return new Response()
   } else {
     return new Response("Unsupported request from from Slack of type " + body.type, {
       status: 400, 
       statusText: "Bad Request"
     })
   }
  }
  
  private async handleEventCallback(event: any) {
    if (event.type == SlackEventType.APP_MENTION) {
      const answer = await this.chatGPTClient.getResponse(event.text)
      await this.slackClient.postMessage({
        text: answer,
        channel: event.channel,
        thread_ts: event.ts
      })
    } else if (event.type == SlackEventType.MESSAGE) {
      // Make sure the message was not sent by a bot. If we do not have this check the bot will keep a conversation going with itself.
      if (event.bot_profile == null) {
        const answer = await this.chatGPTClient.getResponse(event.text)
        await this.slackClient.postMessage({
          text: answer,
          channel: event.channel
        })
      }
    } else {
      throw new Error("Unexpected Slack event of type " + event.type)
    }
  }
}
