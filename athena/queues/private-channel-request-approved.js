// @flow
const debug = require('debug')(
  'athena:queue:user-request-private-channel-approved'
);
import Raven from 'shared/raven';
import addQueue from '../utils/addQueue';
import { getCommunityById } from '../models/community';
import { storeNotification } from '../models/notification';
import { storeUsersNotifications } from '../models/usersNotifications';
import { getUsers } from '../models/user';
import { fetchPayload } from '../utils/payloads';
import isEmail from 'validator/lib/isEmail';

type JobData = {
  data: {
    userId: string,
    channelId: string,
    communityId: string,
    moderatorId: string,
  },
};
export default async (job: JobData) => {
  const { userId, channelId, communityId, moderatorId } = job.data;
  debug(`user request to join channel ${channelId} approved`);

  const [actor, context, entity] = await Promise.all([
    fetchPayload('USER', moderatorId),
    fetchPayload('COMMUNITY', communityId),
    fetchPayload('CHANNEL', channelId),
  ]);

  const eventType = 'PRIVATE_CHANNEL_REQUEST_APPROVED';

  // construct a new notification record to either be updated or stored in the db
  const nextNotificationRecord = Object.assign(
    {},
    {
      event: eventType,
      actors: [actor],
      context,
      entities: [entity],
    }
  );

  // update or store a record in the notifications table, returns a notification
  const updatedNotification = await storeNotification(nextNotificationRecord);

  // get all the user data for the owners
  const recipients = await getUsers([userId]);

  // only get owners with emails
  const filteredRecipients = recipients.filter(user => isEmail(user.email));

  // for each owner, create a notification for the app
  const usersNotificationPromises = filteredRecipients.map(
    async recipient =>
      await storeUsersNotifications(updatedNotification.id, recipient.id)
  );

  // for each owner,send an email
  const channelPayload = JSON.parse(context.payload);
  const community = await getCommunityById(channelPayload.communityId);
  const usersEmailPromises = filteredRecipients.map(
    async recipient =>
      await addQueue('send private channel request approved email', {
        recipient,
        channel: channelPayload,
        community,
      })
  );

  return Promise.all([
    usersEmailPromises, // handle emails separately
    usersNotificationPromises, // update or store usersNotifications in-app
  ]).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
    console.log(err);
  });
};
