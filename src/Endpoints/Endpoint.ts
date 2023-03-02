import { Env } from "../Env"

export interface Endpoint {
  fetch(request: Request, ctx: ExecutionContext): Promise<Response>
}
