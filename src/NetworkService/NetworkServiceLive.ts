import {NetworkService} from "./NetworkService"

export class NetworkServiceLive implements NetworkService {
  async post(url: string, body: any, headers: {[key: string]: string}): Promise<any> {
    let allHeaders = headers || {}
    allHeaders["Content-Type"] = "application/json;charset=utf-8"
    return await fetchWithTimeout(url, {
      method: "post",
      body: JSON.stringify(body),
      headers: allHeaders
    })
  }
}

async function fetchWithTimeout(resource: any, options: any = {}) {
  const timeout : number = options.timeout || 30000;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);

  return response;
}
