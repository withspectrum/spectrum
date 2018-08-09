// @flow
const debug = require('debug')('athena:queue:added-moderator-notification');
import Raven from 'shared/raven';
import { storeNotification } from '../models/notification';
import { storeUsersNotifications } from '../models/usersNotifications';
import { getUsers } from '../models/user';
import { fetchPayload } from '../utils/payloads';
import isEmail from 'validator/lib/isEmail';
import type {
  AddedAsCommunityModeratorNotificationJobData,
  Job,
} from 'shared/bull/types';

export default async (
  job: Job<AddedAsCommunityModeratorNotificationJobData>
) => {
  const { moderatorId, communityId, userId } = job.data;
  debug(`added user as moderator to community ${communityId}`);

  const [actor, context, entity] = await Promise.all([
    fetchPayload('USER', userId),
    fetchPayload('COMMUNITY', communityId),
    fetchPayload('USER', moderatorId),
  ]);

  const eventType = 'ADDED_AS_COMMUNITY_MODERATOR';

  // construct a new notification record to either be updated or stored in the db
  const nextNotificationRecord = Object.assign(
    {},
    {
      event: eventType,
      actors: [actor, entity],
      context,
      entities: [context],
    }
  );
  // update or store a record in the notifications table, returns a notification
  const updatedNotification = await storeNotification(nextNotificationRecord);

  // get all the user data for the owners
  const recipients = await getUsers([moderatorId]);

  // only get owners with emails
  const filteredRecipients = recipients.filter(user => isEmail(user.email));

  // for each owner, create a notification for the app
  const usersNotificationPromises = filteredRecipients.map(recipient =>
    storeUsersNotifications(updatedNotification.id, recipient.id)
  );

  return await Promise.all([
    ...usersNotificationPromises, // update or store usersNotifications in-app
  ]).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
  });
};
