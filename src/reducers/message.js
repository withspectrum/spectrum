// @flow
import type { ReplyToMessageActionType } from '../actions/message';

const initialState = {
  quotedMessage: null,
};

type Actions = ReplyToMessageActionType;

export default function message(
  state: typeof initialState = initialState,
  action: Actions
) {
  switch (action.type) {
    case 'REPLY_TO_MESSAGE':
      return {
        quotedMessage: action.messageId,
      };
    default:
      return state;
  }
}
