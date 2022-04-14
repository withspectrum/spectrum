// @flow
import type { ReplyToMessageActionType } from 'src/actions/message';

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
          [action.threadId]: action.messageId,
        },
      };
    default:
      return state;
  }
}
