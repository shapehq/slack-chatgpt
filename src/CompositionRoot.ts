import { Bot } from "./Bot"
import { ChatGPTClient } from "./ChatGPT/ChatGPTClient"
import { NetworkService } from "./NetworkService/NetworkService"
import { NetworkServiceLive } from "./NetworkService/NetworkServiceLive"
import { SlackClient } from "./Slack/SlackClient"
import { SlackEventsEndpoint } from "./Endpoints/SlackEventsEndpoint"
import { SlackShortcutsEndpoint } from "./Endpoints/SlackShortcutsEndpoint"

export class CompositionRoot {
  static getSlackEventsEndpoint(openAIAPIKey: string, slackToken: string): SlackEventsEndpoint {
    return new SlackEventsEndpoint(this.getBot(openAIAPIKey, slackToken))
  }
  
  static getSlackShortcutsEndpoint(openAIAPIKey: string, slackToken: string): SlackShortcutsEndpoint {
    return new SlackShortcutsEndpoint(this.getBot(openAIAPIKey, slackToken))
  }
  
  private static getBot(openAIAPIKey: string, slackToken: string): Bot {
    return new Bot(
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