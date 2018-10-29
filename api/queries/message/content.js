// @flow
import type { GraphQLContext } from '../../';
import type { DBMessage } from 'shared/types';
import body from './content/body';

export default (message: DBMessage, _: any, ctx: GraphQLContext) => ({
  body: body(message, ctx.getImageSignatureExpiration()),
});
