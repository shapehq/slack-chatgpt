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
  
  static unauthorized(message: string): Response {
    return new Response(message, {
      status: 401, 
      statusText: "Unauthorized"
    })
  }
  
  static json(body: any): Response {
    const json = JSON.stringify(body, null, 2);
    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    })
  }
}