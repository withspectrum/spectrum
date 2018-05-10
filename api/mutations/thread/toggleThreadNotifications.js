// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getThreadNotificationStatusForUser,
  updateThreadNotificationStatusForUser,
  createNotifiedUserInThread,
} from '../../models/usersThreads';
import { getThread } from '../../models/thread';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

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
    .then(threadToEvaluate => {
      if (threadToEvaluate) {
        // a relationship with this thread exists, we are going to update it
        let value;
        if (threadToEvaluate.receiveNotifications) {
          // if they are currently receiving notifications, turn them off
          value = false;
          trackQueue.add({
            userId: currentUser.id,
            event: events.THREAD_NOTIFICATIONS_DISABLED,
            context: { threadId },
          });
          return updateThreadNotificationStatusForUser(
            threadId,
            currentUser.id,
            value
          );
        } else {
          // if they aren't receiving notifications, turn them on
          value = true;
          trackQueue.add({
            userId: currentUser.id,
            event: events.THREAD_NOTIFICATIONS_ENABLED,
            context: { threadId },
          });
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
