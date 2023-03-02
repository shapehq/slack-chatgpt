import { Bot } from "../Bot"
import { Endpoint } from "./Endpoint"
import { readRequestBody } from "../readRequestBody"
import { ResponseFactory } from "../ResponseFactory"
import { SlackCallbackID } from "../Slack/SlackCallbackID"
import { SlackEventType } from "../Slack/SlackEventType"

export class SlackShortcutsEndpoint implements Endpoint {
  bot: Bot
  
  constructor(bot: Bot) {
    this.bot = bot
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
    const payload = JSON.parse(body.payload)
    if (payload.type == SlackEventType.SHORTCUT) {
      return await this.handleShortcut(payload)
    } else if (payload.type == SlackEventType.BLOCK_ACTIONS) {
      return await this.handleBlockActions(payload, ctx)
    } else if (payload.type == SlackEventType.VIEW_SUBMISSION) {
      return await this.handleViewSubmission(payload)
    } else {
      return ResponseFactory.badRequest("Unsupported payload type: " + payload.type)
    }
  }
  
  private async handleShortcut(payload: any): Promise<Response> {
    if (payload.callback_id == SlackCallbackID.ASK_CHATGPT_GLOBAL) {
      await this.bot.openPromptView(payload.trigger_id)
      return new Response()
    } else if (payload.callback_id == SlackCallbackID.ASK_CHATGPT_ON_MESSAGE) {
      await this.bot.postReply(payload.message.text, payload.channel.name, payload.message.ts)
      return new Response()
    } else {
      return ResponseFactory.badRequest("Unsupported callback ID: " + payload.callback_id)
    }
  }
   
  private async handleBlockActions(payload: any, ctx: ExecutionContext): Promise<Response> {
    console.log(JSON.stringify(payload, null, 2))
    if (payload.view.callback_id == SlackCallbackID.PROMPT) {
      const prompt = payload.view.state.values.prompt.prompt.value
      let p = this.bot.updatePromptView(payload.view.id, prompt)
      ctx.waitUntil(p)
      return new Response()
    } else {
      return ResponseFactory.badRequest("Unsupported callback ID: " + payload.callback_id)
    }
  }
  
  private async handleViewSubmission(payload: any): Promise<Response> {
    if (payload.view.callback_id == SlackCallbackID.PROMPT) {
      const prompt = payload.view.state.values.prompt.prompt.value
      await this.bot.updatePromptView(payload.view.id, prompt)
      return new Response()
    } else {
      return ResponseFactory.badRequest("Unsupported callback ID: " + payload.callback_id)
    }
  }
}
