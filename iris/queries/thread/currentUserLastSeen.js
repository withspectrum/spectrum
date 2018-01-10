// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';
import { getThreadNotificationStatusForUser } from '../../models/usersThreads';

export default ({ id }: DBThread, _: any, { user }: GraphQLContext) => {
  if (!user || !user.id) return null;

  return getThreadNotificationStatusForUser(id, user.id).then(result => {
    if (!result || result.length === 0) return;
    const data = result[0];
    if (!data || !data.lastSeen) return null;

    return data.lastSeen;
  });
};
