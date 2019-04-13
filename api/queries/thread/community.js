// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default async (root: DBThread, _: any, ctx: GraphQLContext) => {
  const { communityId, id } = root;
  const { loaders } = ctx;
  const community = await loaders.community.load(communityId);
  if (!community) {
    console.error(
      'User queried thread of non-existent/deleted community: ',
      communityId
    );
    console.error('Thread queried: ', id);
  }
  return community;
};
