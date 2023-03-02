export class ResponseFactory {
  static badRequest(message: string): Response {
    return new Response(message, {
      status: 400, 
      statusText: "Bad Request"
    })
  }
  
  static internalServerError(message: string): Response {
    return new Response(message, {
      status: 500, 
      statusText: "Internal Server Error"
    })
  }
}