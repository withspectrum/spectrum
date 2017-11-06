// @flow
const debug = require('debug')('athena:queue:community-notification');
import Raven from '../../shared/raven';
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

type JobData = {
  data: {
    communityId: string,
    userId: string,
  },
};
export default async (job: JobData) => {
  const { communityId: incomingCommunityId, userId: currentUserId } = job.data;
  debug(`new job for ${incomingCommunityId} by ${currentUserId}`);

  /*
		These promises are used to create or modify a notification. The order is:
		- actor
		- context

		In this case the actor and entity (user who is joing the community) will be the same
  */
  const actor = await fetchPayload('USER', currentUserId);
  const context = await fetchPayload('COMMUNITY', incomingCommunityId);
  const entity = actor;

  const notification = await checkForExistingNotification(
    'USER_JOINED_COMMUNITY',
    incomingCommunityId
  );

  if (notification) {
    debug('found existing notification');

    // actors should always be distinct to make client side rendering easier
    const distinctActors = getDistinctActors([...notification.actors, actor]);

    // create a new notification
    // in this case we always want the actors and entities to be in sync because the notification should only ever reflect who has actually joined the community
    const newNotification = Object.assign({}, notification, {
      actors: [...distinctActors],
      context,
      entities: [...distinctActors],
    });

    debug('update existing notification in database with new data');

    const updatedNotification = await updateNotification(newNotification);

    // get the owners of the community
    const recipients = await getOwnersInCommunity(incomingCommunityId);
    debug('find recipients of notification');

    const notificationPromises = recipients.map(
      async recipient =>
        await markUsersNotificationsAsNew(updatedNotification.id, recipient)
    );

    debug('mark notification as new for all recipients');
    return Promise.all([notificationPromises]).catch(err => {
      Raven.captureException(err);
      console.log(err);
    });
  } else {
    // if no notification was found that matches our bundling criteria, create a new notification
    // create the notification record
    const notification = {
      actors: [actor],
      event: 'USER_JOINED_COMMUNITY',
      context,
      entities: [entity],
    };
    debug('create notification in db');

    const updatedNotification = await storeNotification(notification);

    // get the owners of the community
    const recipients = await getOwnersInCommunity(incomingCommunityId);
    debug('find recipients of notification');

    const notificationPromises = recipients.map(
      async recipient =>
        await storeUsersNotifications(updatedNotification.id, recipient)
    );
    debug('create a notification for every recipient');

    return Promise.all([notificationPromises]).catch(err => {
      Raven.captureException(err);
      console.log(err);
    });
  }
};
