// @flow
import type { DBThread } from 'shared/types';
import body from './content/body';

export default (thread: DBThread) => {
  return {
    title: thread.content.title,
    body: body(thread),
  };
};
