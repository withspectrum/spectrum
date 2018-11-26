// @flow
import type { DBMessage } from 'shared/types';
import { signMessage } from 'shared/imgix';

export default (message: DBMessage, expires: number) => {
  const {
    content: { body },
  } = signMessage(message, expires);
  return body;
};
