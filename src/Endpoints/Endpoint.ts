export interface Endpoint {
  fetch(request: Request, ctx: ExecutionContext): Promise<Response>
}
