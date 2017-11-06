// @flow
const debug = require('debug')('athena:queue:channel-notification');
import Raven from '../../shared/raven';
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
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

type JobData = {
  data: {
    channel: {
      id: string,
      communityId: string,
      slug: string,
    },
    userId: string,
  },
};
export default async (job: JobData) => {
  const incomingChannel = job.data.channel;
  const currentUserId = job.data.userId;

  debug(`new job for ${incomingChannel.id} by ${currentUserId}`);

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
  const actor = await fetchPayload('USER', currentUserId);
  const context = await fetchPayload('COMMUNITY', incomingChannel.communityId);
  const entity = await createPayload('CHANNEL', incomingChannel);

  const notification = await checkForExistingNotification(
    'CHANNEL_CREATED',
    incomingChannel.communityId
  );

  if (notification) {
    debug('found existing channel creation notification');

    // actors should always be distinct to make client side rendering easier
    const distinctActors = getDistinctActors([...notification.actors, actor]);

    // create a new notification
    const newNotification = Object.assign({}, notification, {
      actors: [...distinctActors],
      context,
      entities: [...notification.entities, entity],
    });

    const updatedNotification = await updateNotification(newNotification);
    debug('update existing notification in database with new data');

    // get the recipients of the notification by finding all members in the community that have notifications turned on
    const recipients = await getMembersInCommunity(notification.context.id);
    debug('find recipients of notification');

    // filter out the user who created the channel
    let filteredRecipients = recipients.filter(
      recipient => recipient !== currentUserId
    );
    debug('mark notification as new for all recipients');

    const notificationPromises = filteredRecipients.map(
      async recipient =>
        await markUsersNotificationsAsNew(updatedNotification.id, recipient)
    );

    // for each person who should receie an updated notification, mark their notification as unseen and unread
    return Promise.all([notificationPromises]).catch(err => {
      debug('❌ Error in job:\n');
      debug(err);
      Raven.captureException(err);
      console.log(err);
    });
  } else {
    // if no notification was found that matches our bundling criteria, create a new notification
    // create the notification record
    const newNotification = {
      actors: [actor],
      event: 'CHANNEL_CREATED',
      context,
      entities: [entity],
    };

    debug('create notification in db');

    const updatedNotification = await storeNotification(newNotification);

    // get the recipients of the notification by finding all members in the community that have notifications turned on
    const recipients = await getMembersInCommunity(
      updatedNotification.context.id
    );
    debug('find recipients of notification');

    let filteredRecipients = recipients.filter(
      recipient => recipient !== currentUserId
    );
    debug('create a notification for every recipient');

    const notificationPromises = filteredRecipients.map(
      async recipient =>
        await storeUsersNotifications(updatedNotification.id, recipient)
    );

    return Promise.all([notificationPromises]).catch(err => {
      debug('❌ Error in job:\n');
      debug(err);
      Raven.captureException(err);
      console.log(err);
    });
  }
};
