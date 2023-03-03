import { SlackActionID } from "./SlackActionID"
import { SlackLoadingMessage } from "./SlackLoadingMessage"

interface SlackPromptViewOptions {
  isLoading?: boolean
  answer?: string
}

export class SlackView {
  static prompt(options?: SlackPromptViewOptions) {
    let blocks: any[] = [{
      type: "input",
      block_id: "prompt",
      label: {
        type: "plain_text",
        text: "Question"
      },
      element: {
        type: "plain_text_input",
        action_id: SlackActionID.PROMPT,
        placeholder: {
          type: "plain_text",
          text: "Write an announcement for the next iPhone"
        },
        multiline: false,
        dispatch_action_config: {
          trigger_actions_on: ["on_enter_pressed"]
        }
      },
      dispatch_action: true,
      optional: false
    }]
    if (options?.isLoading || options?.answer != null) {
      blocks.push({
        type: "section",
        block_id: "answer_title",
        text: {
          type: "mrkdwn",
          text: "*Message 🧠*"
        }
      })
    }
    if (options?.isLoading) {
      blocks.push({
        type: "section",
        block_id: "loading",
        text: {
          type: "plain_text",
          text: SlackLoadingMessage.getRandom()
        }
      })
    }
    if (options?.answer != null) {
      blocks = blocks.concat([{
        type: "section",
        block_id: "answer",
        text: {
          type: "plain_text",
          text: options.answer
        }
      }, {
        type: "input",
        block_id: "conversations",
        label: {
          type: "plain_text",
          text: "Conversation"
        },
        element: {
          type: "conversations_select",
          action_id: SlackActionID.CONVERSATION,
          default_to_current_conversation: true,
          response_url_enabled: true
        }
      }])
    }
    let view: any = {
      type: "modal",
      title: {
        type: "plain_text",
        text: "Ask ChatGPT"
      },
      blocks: blocks,
      submit: {
        type: "plain_text",
        text: "Send"
      }
    }
    if (options?.answer != null && options.answer.length > 0) {
      view.private_metadata = options.answer
    }
    return view
  }
}