import { CompositionRoot } from "./CompositionRoot"
import { Endpoint } from "./Endpoints/Endpoint"
import { Env } from "./Env"
import { ResponseFactory } from "./ResponseFactory"
import { verifySlackSignature } from "./verifySlackSignature"

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const endpoint = getEndpoint(url.pathname, env)
    if (endpoint != null) {
      const clonedRequest = await request.clone()
      const isSlackSignatureVerified = await verifySlackSignature(clonedRequest, env.SLACK_SIGNING_SECRET)
      if (isSlackSignatureVerified) {
        return await endpoint.fetch(request)
      } else {
        return ResponseFactory.unauthorized("The Slack signature is invalid")
      }
    } else {
      return ResponseFactory.badRequest("Unknown path: " + url.pathname)
    }
  }
}

function getEndpoint(pathname: string, env: Env): Endpoint | null {
  const pathComponents = pathname.slice(1).split("/").filter(e => e.length > 0)
  if (pathComponents.length == 1 && pathComponents[0] == "events") {
    return CompositionRoot.getSlackEventsEndpoint(env.OPENAI_API_KEY, env.SLACK_TOKEN)
  } else if (pathComponents.length == 1 && pathComponents[0] == "shortcuts") {
    return CompositionRoot.getSlackShortcutsEndpoint(env.OPENAI_API_KEY, env.SLACK_TOKEN)
  } else {
    return null
  }
}