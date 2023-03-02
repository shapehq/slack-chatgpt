import { Env } from "../Env"
import { readRequestBody } from "../readRequestBody"
import { SlackEventCallbackHandler } from "./SlackEventCallbackHandler"

export class SlackRequestHandler {
  eventCallbackHandler: SlackEventCallbackHandler
  
  constructor(eventCallbackHandler: SlackEventCallbackHandler) {
    this.eventCallbackHandler = eventCallbackHandler
  }
  
  async handle(request: Request): Promise<Response> {
    const body = await readRequestBody(request)
    if (body.type == "url_verification") {
      return new Response(body.challenge)
    } else if (body.type == "event_callback") {
      await this.eventCallbackHandler.handle(body.event)
      return new Response()
    } else {
      return new Response("Unsupported request from from Slack of type " + body.type, {
        status: 400, 
        statusText: "Bad Request"
      })
    }
  }
}