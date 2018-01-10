// @flow

export default (_, { threadId }, { user }) => {
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
          return updateThreadNotificationStatusForUser(
            threadId,
            currentUser.id,
            value
          );
        } else {
          // if they aren't receiving notifications, turn them on
          value = true;
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
