import { SlackCallbackID } from "./SlackCallbackID"

export const SlackModalView = {
  prompt(message?: string): any {
    const hasMessage = message != null && message.length > 0
    let blocks: any[] = [{
      type: "input",
      block_id: "prompt",
      label: {
        type: "plain_text",
        text: "Question"
      },
      element: {
        type: "plain_text_input",
        action_id: "prompt",
        placeholder: {
          type: "plain_text",
          text: "Enter your question"
        },
        focus_on_load: !hasMessage
      }
    }]
    if (hasMessage) {
      blocks.push({
        type: "input",
        block_id: "message",
        label: {
          type: "plain_text",
          text: "Message"
        },
        element: {
          type: "plain_text_input",
          action_id: "message",
          placeholder: {
            type: "plain_text",
            text: "Message"
          },
          initial_value: message,
          multiline: true
        }
      })
    }
    blocks.push({
      type: "actions",
      elements: [{
        type: "button",
        text: {
          type: "plain_text",
          text: "Ask"
        },
        action_id: "ask"
      }]
    })
    return {
      type: "modal",
      callback_id: SlackCallbackID.PROMPT,
      title: {
        type: "plain_text",
        text: "Ask ChatGPT"
      },
      submit: {
        type: "plain_text",
        text: "Ask"
      },
      close: {
        type: "plain_text",
        text: "Cancel"
      },
      blocks: blocks
    }
  }
}
