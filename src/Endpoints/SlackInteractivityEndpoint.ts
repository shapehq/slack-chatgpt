import { ChatGPTClient } from "../ChatGPTClient"
import { Endpoint } from "./Endpoint"
import { readRequestBody } from "../readRequestBody"
import { ResponseFactory } from "../ResponseFactory"
import { SlackActionID } from "../Slack/SlackActionID"
import { SlackCallbackID } from "../Slack/SlackCallbackID"
import { SlackClient } from "../Slack/SlackClient"
import { SlackEventType } from "../Slack/SlackEventType"
import { SlackView } from "../Slack/SlackView"

export class SlackInteractivityEndpoint implements Endpoint {
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
    const payload = JSON.parse(body.payload)
    if (payload.type == SlackEventType.MESSAGE_ACTION) {
      return await this.handleMessageAction(payload, ctx)
    } else if (payload.type == SlackEventType.SHORTCUT) {
      return await this.handleShortcut(payload, ctx)
    } else if (payload.type == SlackEventType.BLOCK_ACTIONS) {
      return await this.handleBlockAction(payload, ctx)
    } else if (payload.type == SlackEventType.VIEW_SUBMISSION) {
      return await this.handleViewSubmission(payload, ctx)
    } else {
      return ResponseFactory.badRequest("Unsupported payload type: " + payload.type)
    }
  }
  
  private async handleMessageAction(payload: any, ctx: ExecutionContext): Promise<Response> {
    if (payload.callback_id == SlackCallbackID.ASK_CHATGPT_ON_MESSAGE) {
      let answerPromise = this.postAnswer(payload.message.text, payload.channel.name, payload.message.ts)
      ctx.waitUntil(answerPromise)
      return new Response()
    } else {
      return ResponseFactory.badRequest("Unsupported callback ID: " + payload.callback_id)
    }
  }
  
  private async handleShortcut(payload: any, ctx: ExecutionContext): Promise<Response> {
    if (payload.callback_id == SlackCallbackID.ASK_CHATGPT_GLOBAL) {
      await this.slackClient.openView(payload.trigger_id, SlackView.prompt())
      return new Response()
    } else {
      return ResponseFactory.badRequest("Unsupported callback ID: " + payload.callback_id)
    }
  }
   
  private async handleBlockAction(payload: any, ctx: ExecutionContext): Promise<Response> {
    if (payload.actions.length == 0) {
      return ResponseFactory.badRequest("No action found")
    }
    const action = payload.actions[0]
    if (action.action_id == SlackActionID.PROMPT) {
      await this.slackClient.updateView(payload.view.id, SlackView.prompt({ isLoading: true }))
      const prompt = payload.view.state.values.prompt.prompt.value
      let answerPromise = this.showAnswerInPromptView(payload.view.id, prompt)
      ctx.waitUntil(answerPromise)
      return new Response()
    } else if (action.action_id == SlackActionID.CONVERSATION) {
      return new Response()
    } else {
      return ResponseFactory.badRequest("Unsupported callback ID: " + payload.callback_id)
    }
  }
     
  private async handleViewSubmission(payload: any, ctx: ExecutionContext): Promise<Response> {
    const answer = payload.view.private_metadata
    if (answer == null || answer.length == 0) {
      return ResponseFactory.json({
        response_action: "errors",
        errors: {
          prompt: "Please enter a prompt and wait for ChatGPT to answer."
        }
      })  
    }
    const responseURL = payload.response_urls.length > 0 ? payload.response_urls[0].response_url : null
    if (answer == null || answer.length == 0) {
      return ResponseFactory.json({
        response_action: "errors",
        errors: {
          prompt: "Please ensure you have selected a conversation."
        }
      })  
    }
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
          text: "by <@" + payload.user.id + ">"
        }]
      }]
    })
    return new Response()
  }
  
  private async showAnswerInPromptView(viewId: string, prompt: string) {
    const answer = await this.chatGPTClient.getResponse(prompt)
    await this.slackClient.updateView(viewId, SlackView.prompt({ answer: answer }))
  }
  
  private async postAnswer(prompt: string, channel: string, threadTs?: string) {
    const answer = await this.chatGPTClient.getResponse(prompt)
    await this.slackClient.postMessage({
      text: answer, 
      channel: channel, 
      thread_ts: threadTs
    })
  }
}
