// @flow
const debug = require('debug')(
  'athena:queue:user-requested-join-private-community'
);
import Raven from 'shared/raven';
import { getCommunityById } from '../models/community';
import { storeNotification } from '../models/notification';
import { storeUsersNotifications } from 'shared/db/queries/usersNotifications';
import {
  getOwnersInCommunity,
  getModeratorsInCommunity,
} from '../models/usersCommunities';
import { getUsers } from 'shared/db/queries/user';
import { fetchPayload } from '../utils/payloads';
import isEmail from 'validator/lib/isEmail';
import { sendPrivateCommunityRequestEmailQueue } from 'shared/bull/queues';
import type { Job, PrivateCommunityRequestJobData } from 'shared/bull/types';
import { signCommunity, signUser } from 'shared/imgix';

export default async (job: Job<PrivateCommunityRequestJobData>) => {
  const { userId, communityId } = job.data;
  debug(
    `new request to join a private community from user ${userId} in community ${communityId}`
  );

  const [actor, context] = await Promise.all([
    fetchPayload('USER', userId),
    fetchPayload('COMMUNITY', communityId),
  ]);

  const eventType = 'PRIVATE_COMMUNITY_REQUEST_SENT';

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

  // get the owners of the community
  const [ownersInCommunity, moderatorsInCommunity] = await Promise.all([
    getOwnersInCommunity(communityId),
    getModeratorsInCommunity(communityId),
  ]);

  const uniqueRecipientIds = [
    ...ownersInCommunity,
    ...moderatorsInCommunity,
  ].filter((item, i, ar) => ar.indexOf(item) === i);

  // get all the user data for the owners
  const recipientsWithUserData = await getUsers([...uniqueRecipientIds]);

  // only get owners + moderators with emails
  const filteredRecipients = recipientsWithUserData.filter(
    owner => owner && owner.email && isEmail(owner.email)
  );

  // for each owner, create a notification for the app
  const usersNotificationPromises = filteredRecipients.map(recipient =>
    storeUsersNotifications(updatedNotification.id, recipient.id)
  );

  // for each owner,send an email
  const userPayload = JSON.parse(actor.payload);
  const community = await getCommunityById(communityId);
  const usersEmailPromises = filteredRecipients.map(recipient =>
    sendPrivateCommunityRequestEmailQueue.add({
      // $FlowFixMe
      user: signUser(userPayload),
      // $FlowFixMe
      recipient: signUser(recipient),
      community: signCommunity(community),
    })
  );

  return Promise.all([
    usersEmailPromises, // handle emails separately
    usersNotificationPromises, // update or store usersNotifications in-app
  ]).catch(err => {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  });
};
