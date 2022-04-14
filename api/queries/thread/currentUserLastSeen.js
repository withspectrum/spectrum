// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default (
  { id }: DBThread,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!user || !user.id) return null;

  return loaders.userThreadNotificationStatus
    .load([user.id, id])
    .then(result => {
      if (!result || result.length === 0) return;
      const data = result;
      if (!data || !data.lastSeen) return null;

      return data.lastSeen;
    });
};
