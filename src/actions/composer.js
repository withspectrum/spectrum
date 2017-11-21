import { track } from '../helpers/events';

export const openComposer = () => {
  track('composer', 'opened', null);

  return {
    type: 'OPEN_COMPOSER',
  };
};

export const closeComposer = (title, body) => ({
  type: 'CLOSE_COMPOSER',
  title: title,
  body: body,
});

export const closeChatInput = payload => ({
  type: 'CLOSE_CHAT_INPUT',
  payload,
});

export const clearChatInput = () => ({
  type: 'CLEAR_CHAT_INPUT',
});
