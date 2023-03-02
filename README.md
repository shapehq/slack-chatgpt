<div align="center">
<img src="./screenshot.png" width="700" alt="A screenshot of a conversation between a person and ChatGPT">
<h3>Integrate <a href="https://openai.com/blog/chatgpt" target="_blank">ChatGPT</a> into Slack using a Slack app hosted on <a href="https://workers.cloudflare.com" target="_blank">Cloudflare Workers</a>.</h3>
</div>

## 🚀 Getting Started

Follow the steps below to get started.

### Create a Cloudflare Worker

The Slack app was built to be hosted on Cloudflare Workers, and as such, we will need to create a worker on Cloudflare Workers.

1. Go to (https://workers.cloudflare.com) and create a worker. Choose any name you would like.
2. Take note of the URL of your worker as you will need it when creating a Slack app.

Cloudflare's [wrangler](https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler) CLI is used to deploy, update, and monitor Cloudflare workers. We will need the CLI later so make sure to install it by running the following command.

```bash
npm install -g wrangler
```

### Register on OpenAI

You will need an OpenAI account to access the ChatGPT API.

1. Register for an account on [platform.openai.com](platform.openai.com).
2. Add billing information to your account if you have already used your free credits or they have expired.
3. Generate an API key and save it for later.

### Create a Slack App

The Slack app will be used to listen for request in Slack and post messages back into Slack.

1. Create a Slack app [here](https://api.slack.com/apps).
2. Enable Event Subscriptions and specify the URL to your Cloudflare Worker.
3. Subscribe to the `app_mention` and `message.im` event names.
4. Add the Bots feature to the Slack app.
5. Add the `app_mentions:read`, `chat:write`, and `im:history` scopes to the bot.
6. Take note of the bot's OAuth token. This is used to post messages back into Slack.

### Add Your Secrets to the Cloudflare Worker

Your Cloudflare worker will need to know your OpenAI API key and the Slack bot's token.

Start by adding the OpenAI API key by running the following command. Paste the API key when prompted to enter it.

```bash
wrangler secret put OPENAI_API_KEY
```

Then add your bot's token running the following command. Paste the token when prompted to enter it.

```bash
wrangler secret put SLACK_TOKEN
```

### Deploy to Cloudflare

After cloning the repository you can deploy it to Cloudflare by running the following command.

```bash
npx wrangler publish
```

ChatGPT should now be integrated with your Slack workspace.

## 💻 Running the Project Locally

To run the project locally, you will need to create a file named `.dev.vars` that contains your secrets. The content of the file should be as shown below.

```
OPENAI_API_KEY=xxx
SLACK_TOKEN=xxx
```

Remember to replace the OpenAI API key and Slack token with your actual credentials.

Then start the server by running the following command.

```bash
npx wrangler dev
```
