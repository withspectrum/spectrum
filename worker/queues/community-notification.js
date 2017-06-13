// @flow
import processQueue from '../process-queue';
import { COMMUNITY_NOTIFICATION } from './constants';
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import { getCommunityById } from '../models/community';
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

export default () =>
  processQueue(COMMUNITY_NOTIFICATION, job => {
    const incomingCommunityId = job.data.communityId;
    const currentUserId = job.data.userId;

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

              return updateNotification(newNotification);
            })
            .then(notification => {
              // get the owners of the community
              const recipients = getOwnersInCommunity(incomingCommunityId);

              return Promise.all([notification, recipients]);
            })
            .then(([notification, recipients]) => {
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

              return storeNotification(notification);
            })
            .then(notification => {
              // get the owners of the community
              const recipients = getOwnersInCommunity(incomingCommunityId);

              return Promise.all([notification, recipients]);
            })
            .then(([notification, recipients]) => {
              return Promise.all(
                recipients.map(recipient =>
                  storeUsersNotifications(notification.id, recipient)
                )
              );
            });
        }
      })
      .catch(err => new Error(err));
  });
