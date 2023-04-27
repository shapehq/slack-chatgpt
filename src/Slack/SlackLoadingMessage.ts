export class SlackLoadingMessage {
  static getRandom(): string {
    const messages = [
      "応答するのに少し時間がかかります。お待ちください。"
    ]
    const idx = Math.floor(Math.random() * messages.length)
    return messages[idx]
  }
}
