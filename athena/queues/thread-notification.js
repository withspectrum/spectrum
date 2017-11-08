// @flow
const debug = require('debug')('athena:queue:community-notification');
import Raven from '../../shared/raven';
import addQueue from '../utils/addQueue';
import getMentions from '../utils/getMentions';
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

const createThreadNotificationEmail = async (thread, recipients) => {
  const creator = await getUserById(thread.creatorId);
  const community = await getCommunityById(thread.communityId);
  const channel = await getChannelById(thread.channelId);

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
      id: string,
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
  const existing = await checkForExistingNotification(
    eventType,
    incomingThread.channelId
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

  // update or store a record in the notifications table, returns a notification
  const updatedNotification = await handleNotificationRecord(
    nextNotificationRecord
  );

  // get the members in the channel
  const recipients = await getMembersInChannelWithNotifications(
    incomingThread.channelId
  );
  // get all the user data for the members
  const recipientsWithUserData = await getUsers([...recipients]);
  // filter out the post author
  const filteredRecipients = recipientsWithUserData.filter(
    r => r.id !== incomingThread.creatorId
  );
  // see if anyone was mentioned in the thread
  const mentions = getMentions(
    toPlainText(toState(JSON.parse(incomingThread.content.body)))
  );
  // if people were mentioned in the thread, let em know
  if (mentions && mentions.length > 0) {
    mentions.forEach(username => {
      addQueue('mention notification', {
        threadId: incomingThread.id, // thread where the mention happened
        senderId: incomingThread.creatorId, // user who created the mention
        username: username,
        type: 'thread',
      });
    });
  }

  // if a user was mentioned, they should only get the mention email
  // and not get a new thread email, so remove them here
  const recipientsWithoutMentions = filteredRecipients.filter(r => {
    return mentions.indexOf(r.username) < 0;
  });

  if (!recipientsWithoutMentions || recipientsWithoutMentions.length === 0)
    return;

  // for each recipient that *wasn't* mentioned, create a notification in the db
  const notificationPromises = recipientsWithoutMentions.map(
    async recipient =>
      await handleUsersNotificationRecord(updatedNotification.id, recipient.id)
  );

  return Promise.all([
    createThreadNotificationEmail(incomingThread, recipientsWithoutMentions), // handle emails separately
    notificationPromises, // update or store notifications in-app
  ]).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
    console.log(err);
  });
};
