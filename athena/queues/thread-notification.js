// @flow
const debug = require('debug')('athena:queue:community-notification');
import Raven from '../../shared/raven';
import addQueue from '../utils/addQueue';
import { toPlainText, toState } from 'shared/draft-utils';
import truncate from 'shared/truncate';
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import getEmailStatus from '../utils/get-email-status';
import {
  storeNotification,
  updateNotification,
  checkForExistingNotification,
} from '../models/notification';
import {
  storeUsersNotifications,
  markUsersNotificationsAsNew,
} from '../models/usersNotifications';
import { getUserById, getUsers } from '../models/user';
import { getCommunityById } from '../models/community';
import { getChannelById } from '../models/channel';
import { getMembersInChannelWithNotifications } from '../models/usersChannels';
import { SEND_THREAD_CREATED_NOTIFICATION_EMAIL } from './constants';

const createThreadNotificationEmail = async thread => {
  const creator = await getUserById(thread.creatorId);
  const community = await getCommunityById(thread.communityId);
  const channel = await getChannelById(thread.channelId);
  const potentialRecipients = await getMembersInChannelWithNotifications(
    thread.channelId
  );
  const potentialRecipientsWithUserData = await getUsers([
    ...potentialRecipients,
  ]);
  const recipients = potentialRecipientsWithUserData.filter(
    r => r.id !== thread.creatorId
  );

  const emailPromises = recipients.map(async recipient => {
    // no way to send the user an email
    if (!recipient.email) return;

    // user is either online or has this notif type turned off
    const shouldSendEmail = await getEmailStatus(
      recipient.id,
      'newThreadCreated'
    );
    if (!shouldSendEmail) return;

    // at this point the email is safe to send, construct data for Hermes
    const rawBody =
      thread.type === 'DRAFTJS'
        ? toPlainText(toState(JSON.parse(thread.content.body)))
        : thread.content.body;
    const body = rawBody && rawBody.length > 10 ? truncate(rawBody, 280) : null;
    const primaryActionLabel = 'View conversation';

    return addQueue(
      SEND_THREAD_CREATED_NOTIFICATION_EMAIL,
      {
        recipient,
        primaryActionLabel,
        thread: {
          ...thread,
          creator,
          community,
          channel,
          content: {
            title: thread.content.title,
            body,
          },
        },
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  });

  return Promise.all([emailPromises]).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
    console.log(err);
  });
};

type JobData = {
  data: {
    thread: {
      channelId: string,
      creatorId: string,
      communityId: string,
      content: {
        title: string,
        body: any,
      },
    },
    userId: string,
  },
};
export default async (job: JobData) => {
  const { thread: incomingThread, userId: currentUserId } = job.data;
  debug(`new job for a thread by ${currentUserId}`);

  const actor = await fetchPayload('USER', currentUserId);
  const context = await fetchPayload('CHANNEL', incomingThread.channelId);
  const entity = await createPayload('THREAD', incomingThread);
  const eventType = 'THREAD_CREATED';

  // determine if a notification already exists
  const existingNotification = await checkForExistingNotification(
    eventType,
    incomingThread.channelId
  );

  // handle the notification record in the db
  const handleNotificationRecord = existingNotification
    ? updateNotification
    : storeNotification;

  // handle the usersNotification record in the db
  const handleUsersNotificationRecord = existingNotification
    ? markUsersNotificationsAsNew
    : storeUsersNotifications;

  // actors should always be distinct to make client side rendering easier
  const distinctActors = existingNotification
    ? getDistinctActors([...existingNotification.actors, actor])
    : [actor];

  // append the new thread to the list of entities
  const entities = existingNotification
    ? [...existingNotification.entities, entity]
    : [entity];

  // construct a new notification record to either be updated or stored in the db
  const nextNotificationRecord = Object.assign(
    {},
    {
      ...existingNotification,
      event: eventType,
      actors: distinctActors,
      context,
      entities,
    }
  );

  // update or store a record in the notifications table, returns a notification
  const updatedNotification = await handleNotificationRecord(
    nextNotificationRecord
  );

  // get the owners of the community
  const recipients = await getMembersInChannelWithNotifications(
    incomingThread.channelId
  );

  // don't trigger a notification for the person who just posted the thread
  const notificationPromises = recipients
    .filter(recipient => recipient !== incomingThread.creatorId)
    .map(
      async recipient =>
        await handleUsersNotificationRecord(updatedNotification.id, recipient)
    );

  return Promise.all([
    createThreadNotificationEmail(incomingThread), // handle emails separately
    notificationPromises, // update or store notifications in-app
  ]).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
    console.log(err);
  });
};
