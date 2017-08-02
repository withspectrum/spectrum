// @flow
const debug = require('debug')('athena:queue:channel-notification');
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import { getCommunityById } from '../models/community';
import { getMembersInCommunity } from '../models/usersCommunities';
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
  const incomingChannel = job.data.channel;
  const currentUserId = job.data.userId;

  debug(
    `
new job for ${incomingChannel.id} by ${currentUserId}`
  );

  // if the channel is the default channel being created at community creation time, don't create a notification
  if (incomingChannel.slug === 'general') {
    debug('ignored new job for default channel');
    return;
  }

  /*
    These promises are used to create or modify a notification. The order is:
    - actor
    - context
    - entity
  */
  const promises = [
    //get the user who created the channel (probably won't be used in the UI)
    fetchPayload('USER', currentUserId),
    // get the community where the channel was created
    fetchPayload('COMMUNITY', incomingChannel.communityId),
    // create an entity payload of the channel that was created
    createPayload('CHANNEL', incomingChannel),
  ];

  return checkForExistingNotification(
    'CHANNEL_CREATED',
    incomingChannel.communityId
  )
    .then(notification => {
      if (notification) {
        debug('found existing channel creation notification');
        return Promise.all([notification, ...promises])
          .then(([notification, actor, context, entity]) => {
            // actors should always be distinct to make client side rendering easier
            const distinctActors = getDistinctActors([
              ...notification.actors,
              actor,
            ]);

            // create a new notification
            const newNotification = Object.assign({}, notification, {
              actors: [...distinctActors],
              context,
              entities: [...notification.entities, entity],
            });

            debug('update existing notification in database with new data');
            return updateNotification(newNotification);
          })
          .then(notification => {
            // get the recipients of the notification by finding all members in the community that have notifications turned on
            const recipients = getMembersInCommunity(notification.context.id);

            debug('find recipients of notification');

            return Promise.all([notification, recipients]);
          })
          .then(([notification, recipients]) => {
            // filter out the user who created the channel
            let filteredRecipients = recipients.filter(
              recipient => recipient !== currentUserId
            );

            debug('mark notification as new for all recipients');

            // for each person who should receie an updated notification, mark their notification as unseen and unread
            return Promise.all(
              filteredRecipients.map(recipient =>
                markUsersNotificationsAsNew(notification.id, recipient)
              )
            );
          });
      } else {
        // if no notification was found that matches our bundling criteria, create a new notification
        return Promise.all([...promises])
          .then(([actor, context, entity]) => {
            // create the notification record
            const notification = {
              actors: [actor],
              event: 'CHANNEL_CREATED',
              context,
              entities: [entity],
            };

            debug('create notification in db');

            return storeNotification(notification);
          })
          .then(notification => {
            // get the recipients of the notification by finding all members in the community that have notifications turned on
            const recipients = getMembersInCommunity(notification.context.id);

            debug('find recipients of notification');

            return Promise.all([notification, recipients]);
          })
          .then(([notification, recipients]) => {
            // filter out the user who created the channel
            let filteredRecipients = recipients.filter(
              recipient => recipient !== currentUserId
            );

            debug('create a notification for every recipient');
            // for each recipient, create a notification
            return Promise.all(
              filteredRecipients.map(recipient =>
                storeUsersNotifications(notification.id, recipient)
              )
            );
          });
      }
    })
    .then(() => job.remove())
    .catch(err => new Error(err));
};
