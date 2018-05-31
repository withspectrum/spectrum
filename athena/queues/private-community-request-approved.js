// @flow
const debug = require('debug')(
  'athena:queue:user-request-private-community-approved'
);
import Raven from 'shared/raven';
import { getCommunityById } from '../models/community';
import { storeNotification } from '../models/notification';
import { storeUsersNotifications } from '../models/usersNotifications';
import { getUsers } from '../models/user';
import { fetchPayload } from '../utils/payloads';
import isEmail from 'validator/lib/isEmail';
import { sendPrivateCommunityRequestApprovedEmailQueue } from 'shared/bull/queues';
import type {
  Job,
  PrivateCommunityRequestApprovedJobData,
} from 'shared/bull/types';

export default async (job: Job<PrivateCommunityRequestApprovedJobData>) => {
  const { userId, communityId, moderatorId } = job.data;
  debug(`user request to join community ${communityId} approved`);

  const [actor, context] = await Promise.all([
    fetchPayload('USER', moderatorId),
    fetchPayload('COMMUNITY', communityId),
  ]);

  const eventType = 'PRIVATE_COMMUNITY_REQUEST_APPROVED';

  // construct a new notification record to either be updated or stored in the db
  const nextNotificationRecord = Object.assign(
    {},
    {
      event: eventType,
      actors: [actor],
      context,
      entities: [context],
    }
  );

  // update or store a record in the notifications table, returns a notification
  const updatedNotification = await storeNotification(nextNotificationRecord);

  const community = await getCommunityById(communityId);
  const recipients = await getUsers([userId]);
  const filteredRecipients = recipients.filter(
    user => user && isEmail(user.email)
  );
  const usersNotificationPromises = filteredRecipients.map(recipient =>
    storeUsersNotifications(updatedNotification.id, recipient.id)
  );

  const usersEmailPromises = filteredRecipients.map(recipient =>
    sendPrivateCommunityRequestApprovedEmailQueue.add({
      // $FlowIssue
      recipient,
      community,
    })
  );

  return await Promise.all([
    ...usersEmailPromises, // handle emails separately
    ...usersNotificationPromises, // update or store usersNotifications in-app
  ]).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  });
};
