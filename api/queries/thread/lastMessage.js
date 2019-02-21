// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';
import { getLastMessage } from '../../models/message';

export default async ({ id }: DBThread, _: any, ctx: GraphQLContext) => {
  return await getLastMessage(id);
};
