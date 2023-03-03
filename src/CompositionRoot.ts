import { ChatGPTClient } from "./ChatGPTClient"
import { NetworkService } from "./NetworkService/NetworkService"
import { NetworkServiceLive } from "./NetworkService/NetworkServiceLive"
import { SlackClient } from "./Slack/SlackClient"
import { SlackEventsEndpoint } from "./Endpoints/SlackEventsEndpoint"
import { SlackCommandsEndpoint } from "./Endpoints/SlackCommandsEndpoint"
import { SlackInteractivityEndpoint } from "./Endpoints/SlackInteractivityEndpoint"

export class CompositionRoot {
  static getSlackEventsEndpoint(openAIAPIKey: string, slackToken: string): SlackEventsEndpoint {
    return new SlackEventsEndpoint(
      this.getChatGPTClient(openAIAPIKey),
      this.getSlackClient(slackToken)
    )
  }
  
  static getSlackCommandsEndpoint(openAIAPIKey: string, slackToken: string): SlackCommandsEndpoint {
    return new SlackCommandsEndpoint(
      this.getChatGPTClient(openAIAPIKey),
      this.getSlackClient(slackToken)
    )
  }
  
  static getSlackInteractivityEndpoint(openAIAPIKey: string, slackToken: string): SlackInteractivityEndpoint {
    return new SlackInteractivityEndpoint(
      this.getChatGPTClient(openAIAPIKey),
      this.getSlackClient(slackToken)
    )
  }
  
  private static getChatGPTClient(apiKey: string): ChatGPTClient {
    return new ChatGPTClient(this.getNetworkService(), apiKey)
  }
  
  private static getSlackClient(token: string): SlackClient {
    return new SlackClient(this.getNetworkService(), token)
  }
  
  private static getNetworkService(): NetworkService {
    return new NetworkServiceLive()
  }
}