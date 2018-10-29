// @flow
import type { DBMessage } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

export default (message: DBMessage) => {
  const { content, messageType } = message;
  if (messageType !== 'media') return content.body;
  return signImageUrl(content.body);
};
