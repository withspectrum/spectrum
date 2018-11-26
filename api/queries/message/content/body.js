// @flow
import type { DBMessage } from 'shared/types';
import { signMessage } from 'shared/imgix';

export default (message: DBMessage, expires: number) => {
  const signedMessage = signMessage(message, expires);
  return signedMessage.content.body;
};
