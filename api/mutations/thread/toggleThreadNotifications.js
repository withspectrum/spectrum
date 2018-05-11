// @flow
import type { GraphQLContext } from '../../';
import {
  getThreadNotificationStatusForUser,
  updateThreadNotificationStatusForUser,
  createNotifiedUserInThread,
} from '../../models/usersThreads';
import { getThread } from '../../models/thread';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  threadId: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { threadId } = args;

  // check to see if a relationship between this user and this thread exists
  return getThreadNotificationStatusForUser(threadId, user.id)
    .then(threadToEvaluate => {
      if (threadToEvaluate) {
        // a relationship with this thread exists, we are going to update it
        let value;
        if (threadToEvaluate.receiveNotifications) {
          // if they are currently receiving notifications, turn them off
          value = false;
          return updateThreadNotificationStatusForUser(
            threadId,
            user.id,
            value
          );
        } else {
          // if they aren't receiving notifications, turn them on
          value = true;
          return updateThreadNotificationStatusForUser(
            threadId,
            user.id,
            value
          );
        }
      } else {
        // if a relationship doesn't exist, create a new one
        return createNotifiedUserInThread(threadId, user.id);
      }
    })
    .then(() => getThread(threadId));
});
