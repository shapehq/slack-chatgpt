export async function readRequestBody(request: Request): Promise<any> {
  const contentType = request.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return await request.json()
  } else {
    throw new Error("Unexpected content type. Expected JSON.")
  }
}