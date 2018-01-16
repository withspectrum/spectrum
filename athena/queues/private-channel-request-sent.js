// @flow
const debug = require('debug')(
  'athena:queue:user-requested-join-private-channel'
);
import Raven from 'shared/raven';
import addQueue from '../utils/addQueue';
import { getCommunityById } from '../models/community';
import { storeNotification } from '../models/notification';
import { storeUsersNotifications } from '../models/usersNotifications';
import { getOwnersInChannel } from '../models/usersChannels';
import { getUsers } from '../models/user';
import { fetchPayload, createPayload } from '../utils/payloads';
import isEmail from 'validator/lib/isEmail';
import type { DBChannel } from 'shared/types';

type JobData = {
  data: {
    userId: string,
    channel: DBChannel,
  },
};
export default async (job: JobData) => {
  const { userId, channel } = job.data;
  debug(
    `new request to join a private channel from user ${userId} in channel ${
      channel.id
    }`
  );

  const [actor, context, entity] = await Promise.all([
    fetchPayload('USER', userId),
    fetchPayload('COMMUNITY', channel.communityId),
    createPayload('CHANNEL', channel),
  ]);

  const eventType = 'PRIVATE_CHANNEL_REQUEST_SENT';

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

  // get the owners of the channel
  const recipients = await getOwnersInChannel(channel.id);

  // get all the user data for the owners
  const recipientsWithUserData = await getUsers([...recipients]);

  // only get owners with emails
  const filteredRecipients = recipientsWithUserData.filter(owner =>
    isEmail(owner.email)
  );

  // for each owner, create a notification for the app
  const usersNotificationPromises = filteredRecipients.map(
    async recipient =>
      await storeUsersNotifications(updatedNotification.id, recipient.id)
  );

  // for each owner,send an email
  const userPayload = JSON.parse(actor.payload);
  const community = await getCommunityById(channel.communityId);
  const usersEmailPromises = filteredRecipients.map(
    async recipient =>
      await addQueue('send request join private channel email', {
        user: userPayload,
        recipient,
        channel,
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
