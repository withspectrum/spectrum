// @flow
import type { DBMessage } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

export const signMessage = (message: DBMessage, expires: number) => {
  const { content, messageType } = message;
  if (messageType !== 'media') return message;
  return signImageUrl(message.content.body, { expires });
};
