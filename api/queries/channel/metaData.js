// TODO: Flow type again
import Raven from 'shared/raven';
import type { DBChannel } from 'shared/types';
import type { GraphQLContext } from '../../';
import { canViewChannel } from '../../utils/permissions';

export default async (root: DBChannel, _: any, ctx: GraphQLContext) => {
  const { user, loaders } = ctx;
  const { id, memberCount: rootMemberCount } = root;

  if (!(await canViewChannel(user, id, loaders))) {
    return {
      members: 0,
    };
  }

  if (typeof rootMemberCount === 'number') {
    return {
      members: rootMemberCount,
    };
  }

  // Fallback if there's no denormalized memberCount, also report to Sentry
  Raven.captureException(
    new Error(`Channel with ID "${id}" does not have denormalized memberCount.`)
  );
  return {
    members: await loaders.channelMemberCount
      .load(id)
      .then(res => (res && res.reduction) || 0),
  };
};
