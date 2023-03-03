export class SlackLoadingMessage {
  static getRandom(): string {
    const messages = [
      "🤖 Let me think about that for a second...",
      "🤖 Crunching, crunching, crunching...",
      "🤖 Let me see...",
      "🤖 Hold on a second, please."
    ]
    const idx = Math.floor(Math.random() * messages.length)
    return messages[idx]
  }
}