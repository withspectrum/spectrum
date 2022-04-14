// @flow
import type { GraphQLContext } from '../../';
import type { DBMessage } from 'shared/types';
import { signMessage } from 'shared/imgix';

export default (message: DBMessage, _: any, ctx: GraphQLContext) => {
  const signedMessage = signMessage(message);
  return signedMessage.content;
};
