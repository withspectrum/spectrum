// @flow
const debug = require('debug')(
  'athena:queue:user-request-private-channel-approved'
);
import Raven from 'shared/raven';
import { getCommunityById } from '../models/community';
import { storeNotification } from '../models/notification';
import { storeUsersNotifications } from 'shared/db/queries/usersNotifications';
import { getUsers } from 'shared/db/queries/user';
import { fetchPayload } from '../utils/payloads';
import isEmail from 'validator/lib/isEmail';
import { sendPrivateChannelRequestApprovedEmailQueue } from 'shared/bull/queues';
import type {
  Job,
  PrivateChannelRequestApprovedJobData,
} from 'shared/bull/types';

export default async (job: Job<PrivateChannelRequestApprovedJobData>) => {
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
  const filteredRecipients = recipients.filter(
    user => user && user.email && isEmail(user.email)
  );

  // for each owner, create a notification for the app
  const usersNotificationPromises = filteredRecipients.map(recipient =>
    storeUsersNotifications(updatedNotification.id, recipient.id)
  );

  // for each owner,send an email
  const channelPayload = JSON.parse(entity.payload);
  const community = await getCommunityById(communityId);
  const usersEmailPromises = filteredRecipients.map(recipient =>
    sendPrivateChannelRequestApprovedEmailQueue.add({
      // $FlowIssue
      recipient,
      channel: channelPayload,
      community,
    })
  );

  return await Promise.all([
    ...usersEmailPromises, // handle emails separately
    ...usersNotificationPromises, // update or store usersNotifications in-app
  ]).catch(err => {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  });
};
