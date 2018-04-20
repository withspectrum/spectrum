// @flow
import type { DBMessage } from 'shared/types';
import type { GraphQLContext } from '../../';

export default (
  { quotedMessageId }: DBMessage,
  _: any,
  { loaders }: GraphQLContext
) => (quotedMessageId ? loaders.message.load(quotedMessageId) : null)
