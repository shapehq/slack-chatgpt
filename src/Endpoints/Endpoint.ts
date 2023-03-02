import { Env } from "../Env"

export interface Endpoint {
  fetch(request: Request): Promise<Response>
}
