// @flow
const debug = require('debug')('athena:queue:new-thread-notification');
import Raven from 'shared/raven';
import axios from 'axios';
import getMentions from 'shared/get-mentions';
import { toPlainText, toState } from 'shared/draft-utils';
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
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
import { getMembersInChannelWithNotifications } from '../models/usersChannels';
import createThreadNotificationEmail from './create-thread-notification-email';
import { sendMentionNotificationQueue } from 'shared/bull/queues';
import type { Job, ThreadNotificationJobData } from 'shared/bull/types';
import { getChannelSettings } from '../models/channelSettings';
import { getChannelById } from '../models/channel';
import { getCommunitySettings } from '../models/communitySettings';
import { truncateString } from '../utils/truncateString';
import { handleSlackChannelResponse } from '../utils/slack';

export default async (job: Job<ThreadNotificationJobData>) => {
  const { thread: incomingThread } = job.data;
  debug(`new job for a thread by ${incomingThread.creatorId}`);

  const [
    actor,
    context,
    entity,
    channelSlackSettings,
    communitySlackSettings,
  ] = await Promise.all([
    fetchPayload('USER', incomingThread.creatorId),
    fetchPayload('CHANNEL', incomingThread.channelId),
    createPayload('THREAD', incomingThread),
    getChannelSettings(incomingThread.channelId),
    getCommunitySettings(incomingThread.communityId),
  ]);
  const eventType = 'THREAD_CREATED';

  // determine if a notification already exists
  const existing = await checkForExistingNotification(
    eventType,
    incomingThread.channelId
  );

  // handle the notification record in the db
  // if it exists, we'll be updating it with new actors and entities
  const handleNotificationRecord = existing
    ? updateNotification
    : storeNotification;

  // handle the usersNotification record in the db
  // if it exists, we'll mark it as new to trigger a badge in the app
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

  // get the members in the channel who should receive notifications
  const recipients = await getMembersInChannelWithNotifications(
    incomingThread.channelId
  );

  // get all the user data for the members
  const recipientsWithUserData = await getUsers([...recipients]);

  // filter out the post author
  const filteredRecipients = recipientsWithUserData.filter(
    r => r.id !== incomingThread.creatorId
  );

  const plainTextBody = incomingThread.content.body
    ? toPlainText(toState(JSON.parse(incomingThread.content.body)))
    : '';
  // see if anyone was mentioned in the thread
  const mentions = getMentions(plainTextBody);
  // if people were mentioned in the thread, let em know
  if (mentions && mentions.length > 0) {
    mentions.forEach(username => {
      sendMentionNotificationQueue.add({
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
    return r.username && mentions.indexOf(r.username) < 0;
  });

  // for each recipient that *wasn't* mentioned, create a notification in the db
  const usersNotificationPromises = recipientsWithoutMentions.map(
    async recipient =>
      await handleUsersNotificationRecord(updatedNotification.id, recipient.id)
  );

  let slackNotificationPromise;
  if (
    // process.env.NODE_ENV === 'production' &&
    communitySlackSettings &&
    communitySlackSettings.slackSettings &&
    communitySlackSettings.slackSettings.token &&
    channelSlackSettings &&
    channelSlackSettings.slackSettings &&
    channelSlackSettings.slackSettings.botConnection &&
    channelSlackSettings.slackSettings.botConnection.threadCreated
  ) {
    const slackChannel =
      channelSlackSettings.slackSettings.botConnection.threadCreated;

    const [author, community, channel] = await Promise.all([
      // $FlowIssue
      getUserById(incomingThread.creatorId),
      getCommunityById(incomingThread.communityId),
      getChannelById(incomingThread.channelId),
    ]);

    slackNotificationPromise = axios({
      method: 'post',
      url: 'https://slack.com/api/chat.postMessage',
      headers: {
        Authorization: `Bearer ${communitySlackSettings.slackSettings.token}`,
      },
      data: {
        channel: slackChannel,
        attachments: [
          {
            fallback: `New conversation published in ${community.name} #${
              channel.name
            }:`,
            author_name: `${author.name} (@${author.username})`,
            author_link: `https://spectrum.chat/users/${author.username}`,
            author_icon: author.profilePhoto,
            pretext: `New conversation published in ${community.name} #${
              channel.name
            }:`,
            title: truncateString(incomingThread.content.title, 80),
            title_link: `https://spectrum.chat/thread/${incomingThread.id}`,
            text: truncateString(plainTextBody, 140),
            footer: 'Spectrum',
            footer_icon:
              'https://spectrum.chat/img/apple-icon-57x57-precomposed.png',
            ts: incomingThread.createdAt,
            color: '#4400CC',
            actions: [
              {
                type: 'button',
                text: 'View conversation',
                url: `https://spectrum.chat/thread/${incomingThread.id}`,
              },
              {
                type: 'button',
                text: `Message ${author.name}`,
                url: `https://spectrum.chat/users/${author.username}`,
              },
            ],
          },
        ],
      },
    }).then(response => {
      return handleSlackChannelResponse(
        response.data,
        incomingThread.communityId
      );
    });
  }

  return Promise.all([
    createThreadNotificationEmail(incomingThread, recipientsWithoutMentions), // handle emails separately
    ...usersNotificationPromises, // update or store usersNotifications in-app
    slackNotificationPromise,
  ]).catch(err => {
    debug('❌ Error in job:\n');
    debug(err);
    Raven.captureException(err);
    console.error(err);
  });
};
