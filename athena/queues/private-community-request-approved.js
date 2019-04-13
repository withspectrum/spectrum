// @flow
const debug = require('debug')(
  'athena:queue:user-request-private-community-approved'
);
import Raven from 'shared/raven';
import { getCommunityById } from '../models/community';
import { storeNotification } from '../models/notification';
import { storeUsersNotifications } from 'shared/db/queries/usersNotifications';
import { getUserById } from 'shared/db/queries/user';
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
  const recipient = await getUserById(userId);

  const canSendEmail = recipient && recipient.email && isEmail(recipient.email);

  const notificationPromise = storeUsersNotifications(
    updatedNotification.id,
    recipient.id
  );

  const emailPromise =
    canSendEmail &&
    sendPrivateCommunityRequestApprovedEmailQueue.add({
      // $FlowIssue
      recipient,
      community,
    });

  return await Promise.all([
    emailPromise, // handle emails separately
    notificationPromise, // update or store usersNotifications in-app
  ]).catch(err => {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  });
};
