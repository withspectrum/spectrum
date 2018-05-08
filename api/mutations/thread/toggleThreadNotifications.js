// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getThreadNotificationStatusForUser,
  updateThreadNotificationStatusForUser,
  createNotifiedUserInThread,
} from '../../models/usersThreads';
import { getThread } from '../../models/thread';
import { track, events } from 'shared/analytics';

export default (
  _: any,
  { threadId }: { threadId: string },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to edit a thread
  if (!currentUser) {
    return new UserError(
      'You must be signed in to get notifications for this thread.'
    );
  }

  // check to see if a relationship between this user and this thread exists
  return getThreadNotificationStatusForUser(threadId, currentUser.id)
    .then(threads => {
      if (threads && threads.length > 0) {
        const threadToEvaluate = threads[0];
        // a relationship with this thread exists, we are going to update it
        let value;
        if (threadToEvaluate.receiveNotifications) {
          // if they are currently receiving notifications, turn them off
          value = false;
          track(currentUser.id, events.THREAD_NOTIFICATIONS_DISABLED);
          return updateThreadNotificationStatusForUser(
            threadId,
            currentUser.id,
            value
          );
        } else {
          // if they aren't receiving notifications, turn them on
          value = true;
          track(currentUser.id, events.THREAD_NOTIFICATIONS_ENABLED);
          return updateThreadNotificationStatusForUser(
            threadId,
            currentUser.id,
            value
          );
        }
      } else {
        // if a relationship doesn't exist, create a new one
        return createNotifiedUserInThread(threadId, currentUser.id);
      }
    })
    .then(() => getThread(threadId));
};
