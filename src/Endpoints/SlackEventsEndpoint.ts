import { Bot } from "../Bot"
import { Endpoint } from "./Endpoint"
import { readRequestBody } from "../readRequestBody"
import { ResponseFactory } from "../ResponseFactory"
import { SlackEventType } from "../Slack/SlackEventType"

export class SlackEventsEndpoint implements Endpoint {
  bot: Bot
  
  constructor(bot: Bot) {
    this.bot = bot
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
      await this.bot.postReply(event.text, event.channel, event.ts)
    } else if (event.type == SlackEventType.MESSAGE) {
      if (event.bot_profile == null) {
        // Make sure the message was not sent by a bot. If we do not have this check the bot will keep a conversation going with itself.
        await this.bot.postReply(event.text, event.channel, null)
      }
    } else {
      throw new Error("Unexpected Slack event of type " + event.type)
    }
  }
}
