import { ChatGPTClient } from "./ChatGPT/ChatGPTClient"
import { Env } from "./Env"
import { NetworkServiceLive } from "./NetworkService/NetworkServiceLive"
import { ResponseFactory } from "./ResponseFactory"
import { SlackClient } from "./Slack/SlackClient"
import { SlackEventCallbackHandler } from "./RequestHandling/SlackEventCallbackHandler"
import { SlackRequestHandler } from "./RequestHandling/SlackRequestHandler"

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method == "POST") {
      try {
        const networkService = new NetworkServiceLive()
        const chatGPTClient = new ChatGPTClient(networkService, env.OPENAI_API_KEY)
        const slackClient = new SlackClient(networkService, env.SLACK_TOKEN)
        const eventCallbackHandler = new SlackEventCallbackHandler(chatGPTClient, slackClient)
        const requestHandler = new SlackRequestHandler(eventCallbackHandler)
        return await requestHandler.handle(request)
      } catch (error) {
        console.log(error)
        if (error instanceof Error) {
          return ResponseFactory.internalServerError(error.toString())
        } else {
          return ResponseFactory.internalServerError("Unknown error")
        }
      }
    } else {
      return ResponseFactory.badRequest("Unsupported HTTP method: " + request.method)
    }
  }
}
