import { Bot } from "../Bot"
import { Endpoint } from "./Endpoint"
import { readRequestBody } from "../readRequestBody"
import { ResponseFactory } from "../ResponseFactory"

export class SlackEventsEndpoint implements Endpoint {
  bot: Bot
  
  constructor(bot: Bot) {
    this.bot = bot
  }
  
  async fetch(request: Request): Promise<Response> {
   if (request.method == "POST") {
     return await this.handlePostRequest(request)
   } else {
     return ResponseFactory.badRequest("Unsupported HTTP method: " + request.method)
   }
  }
  
  private async handlePostRequest(request: Request): Promise<Response> {
    const body = await readRequestBody(request)
    if (body.type == "url_verification") {
     return new Response(body.challenge)
   } else if (body.type == "event_callback") {
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
    if (event.type == "app_mention") {
      await this.bot.postReply(event.text, event.channel, event.ts)
    } else if (event.type == "message") {
      if (event.bot_profile == null) {
        // Make sure the message was not sent by a bot. If we do not have this check the bot will keep a conversation going with itself.
        await this.bot.postReply(event.text, event.channel, null)
      }
    } else {
      throw new Error("Unexpected Slack event of type " + event.type)
    }
  }
}
