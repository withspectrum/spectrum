const debug = require('debug')('athena:queue:community-notification');
import { fetchPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import { getOwnersInCommunity } from '../models/usersCommunities';
import {
  storeNotification,
  updateNotification,
  checkForExistingNotification,
} from '../models/notification';
import {
  storeUsersNotifications,
  markUsersNotificationsAsNew,
} from '../models/usersNotifications';

export default job => {
  const incomingCommunityId = job.data.communityId;
  const currentUserId = job.data.userId;

  debug(
    `
new job for ${incomingCommunityId} by ${currentUserId}`
  );

  /*
		These promises are used to create or modify a notification. The order is:
		- actor
		- context

		In this case the actor and entity (user who is joing the community) will be the same
	*/
  const promises = [
    // actor and entity
    fetchPayload('USER', currentUserId),
    // get the community the user just joined
    fetchPayload('COMMUNITY', incomingCommunityId),
  ];

  return checkForExistingNotification(
    'USER_JOINED_COMMUNITY',
    incomingCommunityId
  )
    .then(notification => {
      if (notification) {
        debug('found existing notification');
        return Promise.all([notification, ...promises])
          .then(([notification, actor, context]) => {
            // actors should always be distinct to make client side rendering easier
            const distinctActors = getDistinctActors([
              ...notification.actors,
              actor,
            ]);

            // create a new notification
            // in this case we always want the actors and entities to be in sync because the notification should only ever reflect who has actually joined the community
            const newNotification = Object.assign({}, notification, {
              actors: [...distinctActors],
              context,
              entities: [...distinctActors],
            });

            debug('update existing notification in database with new data');
            return updateNotification(newNotification);
          })
          .then(notification => {
            // get the owners of the community
            const recipients = getOwnersInCommunity(incomingCommunityId);

            debug('find recipients of notification');

            return Promise.all([notification, recipients]);
          })
          .then(([notification, recipients]) => {
            debug('mark notification as new for all recipients');
            // for each owner, trigger a notification
            return Promise.all(
              recipients.map(recipient =>
                markUsersNotificationsAsNew(notification.id, recipient)
              )
            );
          });
      } else {
        // if no notification was found that matches our bundling criteria, create a new notification
        return Promise.all([...promises])
          .then(([actor, context]) => {
            // create the notification record
            const notification = {
              actors: [actor],
              event: 'USER_JOINED_COMMUNITY',
              context,
              entities: [actor],
            };

            debug('create notification in db');

            return storeNotification(notification);
          })
          .then(notification => {
            // get the owners of the community
            const recipients = getOwnersInCommunity(incomingCommunityId);

            debug('find recipients of notification');

            return Promise.all([notification, recipients]);
          })
          .then(([notification, recipients]) => {
            debug('create a notification for every recipient');
            return Promise.all(
              recipients.map(recipient =>
                storeUsersNotifications(notification.id, recipient)
              )
            );
          });
      }
    })
    .catch(err => console.log(err));
};
