// @flow
const debug = require('debug')('athena:queue:community-notification');
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

  return Promise.all([emailPromises]);
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

  /*
		These promises are used to create or modify a notification. The order is:
		- actor
		- context
		- entity
	*/

  const actor = await fetchPayload('USER', currentUserId);
  const context = await fetchPayload('CHANNEL', incomingThread.channelId);
  const entity = await createPayload('THREAD', incomingThread);
  const existingNotification = await checkForExistingNotification(
    'THREAD_CREATED',
    incomingThread.channelId
  );

  if (existingNotification) {
    debug('found existing notification');
    const notification = existingNotification;
    // actors should always be distinct to make client side rendering easier
    const distinctActors = getDistinctActors([...notification.actors, actor]);

    // create a new notification
    const newNotification = Object.assign({}, notification, {
      actors: [...distinctActors],
      context,
      entities: [...notification.entities, entity],
    });

    const updatedNotification = await updateNotification(newNotification);

    // get the owners of the community
    const recipients = await getMembersInChannelWithNotifications(
      incomingThread.channelId
    );

    debug('find recipients of notification');

    const notificationPromises = recipients
      // don't trigger a notification for the person who just posted the thread
      .filter(recipient => recipient !== incomingThread.creatorId)
      .map(recipient => {
        return Promise.all([
          markUsersNotificationsAsNew(updatedNotification.id, recipient),
        ]);
      });

    debug('mark notification as new for all recipients');

    return Promise.all([
      createThreadNotificationEmail(incomingThread),
      notificationPromises,
    ]);
  } else {
    // create the notification record
    const notification = {
      actors: [actor],
      event: 'THREAD_CREATED',
      context,
      entities: [entity],
    };

    const newNotification = await storeNotification(notification);

    // get the owners of the community
    const recipients = await getMembersInChannelWithNotifications(
      incomingThread.channelId
    );

    debug('create a notification for every recipient');

    const notificationPromises = recipients
      // don't trigger a notification for the person who just posted the thread
      .filter(recipient => recipient !== incomingThread.creatorId)
      .map(recipient => storeUsersNotifications(newNotification.id, recipient));

    return Promise.all([
      createThreadNotificationEmail(incomingThread),
      notificationPromises,
    ]).catch(err => console.log(err));
  }
};
