// @flow
import type { DBThread } from 'shared/types';
import { signThread } from 'shared/imgix';

export default (thread: DBThread, expires: number) => {
  const signedThread = signThread(thread, expires);
  return signedThread.content.body;
};
