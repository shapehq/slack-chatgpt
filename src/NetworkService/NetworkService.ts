export interface NetworkService {
  post(url: string, body: any, headers: {[key: string]: string}): Promise<any>
}