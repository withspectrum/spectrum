// @flow
import type { DBMessage } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

export const signMessage = (
  message: DBMessage,
  expires?: number
): DBMessage => {
  const { content, messageType } = message;
  if (messageType !== 'media') return message;
  return {
    ...message,
    content: {
      ...content,
      body: signImageUrl(message.content.body, { expires }),
    },
  };
};
