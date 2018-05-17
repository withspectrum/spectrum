// @flow
import type { GraphQLContext } from '../../';
import type { DBCommunity } from 'shared/types';
import { getChannelsByCommunity } from '../../models/channel';
import { canViewCommunity } from '../../utils/permissions';

export default async ({ id }: DBCommunity, _: any, ctx: GraphQLContext) => {
  const { user, loaders } = ctx;

  if (!user || !await canViewCommunity(user.id, id, loaders)) {
    return {
      pageInfo: {
        hasNextPage: false,
      },
      edges: [],
    };
  }

  return {
    pageInfo: {
      hasNextPage: false,
    },
    edges: getChannelsByCommunity(id).then(channels =>
      channels.map(channel => ({
        node: channel,
      }))
    ),
  };
};
