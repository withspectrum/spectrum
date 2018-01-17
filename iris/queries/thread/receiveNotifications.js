// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default (
  { id }: DBThread,
  __: any,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser) {
    return false;
  } else {
    return loaders.userThreadNotificationStatus
      .load([currentUser.id, id])
      .then(result => (result ? result.receiveNotifications : false));
  }
};
