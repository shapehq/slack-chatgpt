export async function readRequestBody(request: Request): Promise<any> {
  const contentType = request.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return await request.json()
  } else if (contentType?.includes("form")) {
    const formData = await request.formData()
    const body: any = {}
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }
    return body
  } else {
    throw new Error("Unexpected content type. Expected application/json or form data.")
  }
}
