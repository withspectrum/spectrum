/**
 * Define the message subscription resolvers
 */
module.exports = {
  Subscription: {
    notificationAdded: notification => {
      const isForCurrentUser = notification.users.some(
        user => user.id === user.id
      );
      if (isForCurrentUser) return notification;
    },
  },
};
