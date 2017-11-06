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

  const actor = await fetchPayload('USER', currentUserId);
  const context = await fetchPayload('COMMUNITY', incomingChannel.communityId);
  const entity = await createPayload('CHANNEL', incomingChannel);
  const eventType = 'CHANNEL_CREATED';

  const existing = await checkForExistingNotification(
    eventType,
    incomingChannel.communityId
  );

  // handle the notification record in the db
  const handleNotificationRecord = existing
    ? updateNotification
    : storeNotification;

  // handle the usersNotification record in the db
  const handleUsersNotificationRecord = existing
    ? markUsersNotificationsAsNew
    : storeUsersNotifications;

  // actors should always be distinct to make client side rendering easier
  const distinctActors = existing
    ? getDistinctActors([...existing.actors, actor])
    : [actor];

  // append the new thread to the list of entities
  const entities = existing ? [...existing.entities, entity] : [entity];

  // construct a new notification record to either be updated or stored in the db
  const nextNotificationRecord = Object.assign(
    {},
    {
      ...existing,
      event: eventType,
      actors: distinctActors,
      context,
      entities,
    }
  );

  const updatedNotification = await handleNotificationRecord(
    nextNotificationRecord
  );

  // get the recipients of the notification by finding all members in the community that have notifications turned on
  const recipients = await getMembersInCommunity(
    updatedNotification.context.id
  );

  // filter out the user who created the channel
  let filteredRecipients = recipients.filter(
    recipient => recipient !== currentUserId
  );

  const notificationPromises = filteredRecipients.map(
    async recipient =>
      await handleUsersNotificationRecord(updatedNotification.id, recipient)
  );

  // for each person who should receie an updated notification, mark their notification as unseen and unread
  return Promise.all([notificationPromises]).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
    console.log(err);
  });
};
