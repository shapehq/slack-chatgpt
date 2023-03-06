export class SlackLoadingMessage {
  static getRandom(): string {
    const messages = [
      "Let me think about that for a second...",
      "Crunching, crunching, crunching...",
      "Let me see...",
      "Hold on a second, please.",
      "Loading... It's not you, it's me. I'm always this slow.",
      "Hold tight! I'm working to find the best response for you.",
      "I'm thinking, please wait a moment.",
      "Just a few more seconds, I am is processing your query.",
      "I am looking up the information you requested. Thanks for your patience!",
      "This might take a moment.",
      "I'm working hard to get you the answer you need. Please wait a few more seconds.",
      "Searching for the best solution to your query. Hang in there.",
      "Preparing your response. It will be with you in no time!",
      "I'm working overtime to give you the best response. Thank you for your patience.",
      "Good things come to those who wait, like unicorns and rainbows.",
      "Grab a snack while you wait, we'll be here for a while.",
      "Loading... Don't worry, I'm just taking a coffee break.",
      "If patience is a virtue, you're about to become a saint. I'm loading...",
      "I'm running on caffeine and code. I'll be with you shortly!"
    ]
    const idx = Math.floor(Math.random() * messages.length)
    return messages[idx]
  }
}