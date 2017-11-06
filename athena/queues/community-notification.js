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

  // in this case the actor and entity are the same
  const actor = await fetchPayload('USER', currentUserId);
  const context = await fetchPayload('COMMUNITY', incomingCommunityId);
  const eventType = 'USER_JOINED_COMMUNITY';

  // determine if a notificaiton already exists of this type, and in this community
  const existing = await checkForExistingNotification(
    eventType,
    incomingCommunityId
  );

  // determine whether we will be updating existing records or storing new ones
  const handleNotificationRecord = existing
    ? updateNotification
    : storeNotification;
  const handleUsersNotificationRecord = existing
    ? markUsersNotificationsAsNew
    : storeUsersNotifications;

  // actors should always be distinct to make client side rendering easier
  const distinctActors = existing
    ? getDistinctActors([...existing.actors, actor])
    : [actor];

  // for this notification type, actors and entities are the same
  const entities = distinctActors;

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

  // store or update a notificaiton in the db, returns the db record
  const updatedNotification = await handleNotificationRecord(
    nextNotificationRecord
  );

  // get the owners of the community
  const recipients = await getOwnersInCommunity(incomingCommunityId);

  // either create a new usersNotification record, or update an existing one for aggregation
  const notificationPromises = recipients.map(
    async recipient =>
      await handleUsersNotificationRecord(updatedNotification.id, recipient)
  );

  // return all the updates
  try {
    return Promise.all([notificationPromises]);
  } catch (err) {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
    console.log(err);
  }
};
