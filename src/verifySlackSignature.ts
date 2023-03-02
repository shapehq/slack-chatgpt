// Implementation from https://gist.github.com/phistrom/3d691a2b4845f9ec9421faaebddc0904

const SIGN_VERSION = "v0"

export async function verifySlackSignature(request: Request, signingSecret: string) {
  const timestamp = request.headers.get("x-slack-request-timestamp")
  // remove starting 'v0=' from the signature header
  const signatureStr = request.headers.get("x-slack-signature")?.substring(3)
  if (signatureStr == null) {
    return false
  }
  // convert the hex string of x-slack-signature header to binary
  const signature = hexToBytes(signatureStr)
  const content = await request.text()
  const authString = `${SIGN_VERSION}:${timestamp}:${content}`
  let encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signingSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  )
  return await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(authString)
  )
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let c = 0; c < hex.length; c += 2) {
      bytes[c / 2] = parseInt(hex.substr(c, 2), 16)
  }
  return bytes.buffer
}