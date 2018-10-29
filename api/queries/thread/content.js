// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';
import body from './content/body';

export default (thread: DBThread, _: any, ctx: GraphQLContext) => {
  return {
    title: thread.content.title,
    body: body(thread, ctx.getImageSignatureExpiration()),
  };
};
