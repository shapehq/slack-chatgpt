import { ChatGPTClient } from "../ChatGPTClient"
import { Endpoint } from "./Endpoint"
import { readRequestBody } from "../readRequestBody"
import { ResponseFactory } from "../ResponseFactory"
import { SlackClient } from "../Slack/SlackClient"
import { SlackLoadingMessage } from "../Slack/SlackLoadingMessage"

export class SlackCommandsEndpoint implements Endpoint {
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
    let answerPromise = this.postAnswer(body.response_url, body.user_id, body.text)
    ctx.waitUntil(answerPromise)
    return ResponseFactory.json({
      text: SlackLoadingMessage.getRandom()
    })
  }
    
  private async postAnswer(responseURL: string, userId: string, prompt: string) {
    const answer = await this.chatGPTClient.getResponse(prompt)
    await this.slackClient.postResponse(responseURL, {
      text: answer,
      response_type: "in_channel",
      blocks: [{
        type: "section",
        text: {
          type: "plain_text",
          text: answer
        }
      }, {
        type: "context",
        elements: [{
          type: "mrkdwn",
          text: "by <@" + userId + ">"
        }]
      }]
    })
  }
}
