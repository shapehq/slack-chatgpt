import { ChatGPTMessage } from "./ChatGPTMessage"
import { ChatGPTResponse } from "./ChatGPTResponse"
import { NetworkService } from "../NetworkService/NetworkService"

export class ChatGPTClient {
  networkService: NetworkService
  apiKey: string
  
  constructor(networkService: NetworkService, apiKey: string) {
    this.networkService = networkService
    this.apiKey = apiKey
  }
  
  async getResponse(messages: ChatGPTMessage[]): Promise<ChatGPTResponse> {
    const url = "https://api.openai.com/v1/chat/completions"
    const body = {
      model: "gpt-3.5-turbo",
      messages: messages
    }
    const headers = {
      "Authorization": "Bearer " + this.apiKey
    }
    console.log("Will ask ChatGPT...")
    try {
      const response = await this.networkService.post(url, body, headers)
      console.log(response)
      if ("error" in response) {
        throw new Error(response.error.message)
      } else if ("choices" in response && response.choices.length > 0) {
        return response.choices[0].message
      } else {
        throw new Error("Did not receive any message choices")
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
