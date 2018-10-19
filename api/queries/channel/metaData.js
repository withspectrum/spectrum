// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';
import Raven from 'shared/raven';
import { canViewChannel } from '../../utils/permissions';

// NOTE(@mxstbr): metaData.threads is deprecated and not shown anywhere in the UI
// so we always return 0
export default async (channel: DBChannel, _: any, ctx: GraphQLContext) => {
  const { id, isPrivate, memberCount } = channel;
  const { loaders, user: currentUser } = ctx;

  if (isPrivate) {
    if (!(await canViewChannel(currentUser, id, loaders)))
      return { threads: 0, members: 0 };
  }

  if (typeof memberCount === 'number') {
    return {
      threads: 0,
      members: memberCount || 1,
    };
  }

  // Fallback if there's no denormalized memberCount, also report to Sentry
  Raven.captureException(
    new Error(`Channel with ID "${id}" does not have denormalized memberCount.`)
  );

  return {
    count: await loaders.channelMemberCount
      .load(id)
      .then(
        res => (res && Array.isArray(res.reduction) ? res.reduction.length : 0)
      ),
    threads: 0,
  };
};
