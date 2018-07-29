// @flow
import type { ReplyToMessageActionType } from '../actions/message';

const initialState = {
  quotedMessage: {},
  editingMessage: null,
};

type Actions = ReplyToMessageActionType;

export default function message(
  state: typeof initialState = initialState,
  action: Actions
) {
  switch (action.type) {
    case 'REPLY_TO_MESSAGE':
      return {
        ...state,
        quotedMessage: {
          ...state.quotedMessage,
          [action.threadId]: action.messageId,
        },
      };
    case 'EDIT_MESSAGE':
      return {
        ...state,
        editingMessage: action.messageId,
      };
    default:
      return state;
  }
}
