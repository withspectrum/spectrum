// @flow
import type { ReplyToMessageActionType } from '../actions/message';

const initialState = {
  quotedMessage: {},
};

type Actions = ReplyToMessageActionType;

export default function message(
  state: typeof initialState = initialState,
  action: Actions
) {
  switch (action.type) {
    case 'REPLY_TO_MESSAGE':
      return {
        quotedMessage: {
          ...state.quotedMessage,
          [action.threadId]: {
            messageId: action.messageId,
            snippet: action.snippet,
          },
        },
      };
    default:
      return state;
  }
}
