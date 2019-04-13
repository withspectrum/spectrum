// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';
import { signThread } from 'shared/imgix';

export default (thread: DBThread, _: any, ctx: GraphQLContext) => {
  const signedThread = signThread(thread);
  return {
    ...signedThread.content,
    body: signedThread.content.body,
  };
};
