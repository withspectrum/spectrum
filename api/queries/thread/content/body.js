// @flow
import type { DBThread } from 'shared/types';
import { signThread } from 'shared/imgix';

export default (thread: DBThread, expires: number) => {
  const {
    content: { body },
  } = signThread(thread, expires);
  return body;
};
