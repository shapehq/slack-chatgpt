import {NetworkService} from "./NetworkService"

export class NetworkServiceLive implements NetworkService {
  async post(url: string, body: any, headers: {[key: string]: string}): Promise<any> {
    let allHeaders = headers || {}
    allHeaders["Content-Type"] = "application/json"
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(body),
      headers: allHeaders
    })
    return await response.json()
  }
}