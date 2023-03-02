import { Bot } from "../Bot"
import { Endpoint } from "./Endpoint"
import { readRequestBody } from "../readRequestBody"
import { ResponseFactory } from "../ResponseFactory"

export class SlackShortcutsEndpoint implements Endpoint {
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
    const payload = JSON.parse(body.payload)
    await this.bot.postReply(payload.message.text, payload.channel.name, payload.message.ts)
    return new Response()
  }
}
