import { NetworkService } from "./NetworkService/NetworkService"

export class ChatGPTClient {
  networkService: NetworkService
  apiKey: string
  
  constructor(networkService: NetworkService, apiKey: string) {
    this.networkService = networkService
    this.apiKey = apiKey
  }
  
  async getResponse(prompt: string): Promise<string> {
    const url = "https://api.openai.com/v1/chat/completions"
    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
      ]
    }
    const headers = {
      "Authorization": "Bearer " + this.apiKey
    }
    try {
      const response = await this.networkService.post(url, body, headers)
      const json = await response.json()
      if ("error" in json) {
        throw new Error(json.error.message)
      } else if ("choices" in json && json.choices.length > 0) {
        return json.choices[0].message.content
      } else {
        throw new Error("Did not receive any message choices")
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
