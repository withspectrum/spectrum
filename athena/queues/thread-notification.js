// @flow
const debug = require('debug')('athena:queue:new-thread-notification');
import Raven from 'shared/raven';
import axios from 'axios';
import getMentions from 'shared/get-mentions';
import { toPlainText, toState } from 'shared/draft-utils';
import { getUserById, getUsers } from 'shared/db/queries/user';
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
import { decryptString } from 'shared/encryption';
import { signThread, signUser } from 'shared/imgix';

export default async (job: Job<ThreadNotificationJobData>) => {
  const { thread: incomingThread } = job.data;
  debug(`new job for a thread by ${incomingThread.creatorId}`);

  const [channelSlackSettings, communitySlackSettings] = await Promise.all([
    getChannelSettings(incomingThread.channelId),
    getCommunitySettings(incomingThread.communityId),
  ]);

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

  const signedRecipientsWithoutMentions = recipientsWithoutMentions.map(r => {
    return signUser(r);
  });

  let slackNotificationPromise;
  if (
    // process.env.NODE_ENV === 'production' &&
    communitySlackSettings &&
    communitySlackSettings.slackSettings &&
    communitySlackSettings.slackSettings.token &&
    channelSlackSettings &&
    channelSlackSettings.slackSettings &&
    channelSlackSettings.slackSettings.botLinks &&
    channelSlackSettings.slackSettings.botLinks.threadCreated
  ) {
    const slackChannel =
      channelSlackSettings.slackSettings.botLinks.threadCreated;

    const [author, community, channel] = await Promise.all([
      // $FlowIssue
      getUserById(incomingThread.creatorId),
      getCommunityById(incomingThread.communityId),
      getChannelById(incomingThread.channelId),
    ]);

    const signedAuthor = signUser(author);

    const decryptedToken = decryptString(
      communitySlackSettings.slackSettings.token
    );

    slackNotificationPromise = axios({
      method: 'post',
      url: 'https://slack.com/api/chat.postMessage',
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
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
            author_icon: signedAuthor.profilePhoto,
            pretext: `New conversation published in ${community.name} #${
              channel.name
            }:`,
            title: truncateString(incomingThread.content.title, 80),
            title_link: `https://spectrum.chat/thread/${incomingThread.id}`,
            text: truncateString(plainTextBody, 140),
            footer: 'Spectrum',
            footer_icon:
              'https://spectrum.chat/img/apple-icon-57x57-precomposed.png',
            ts: new Date(incomingThread.createdAt).getTime() / 1000,
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

  const signedThread = signThread(incomingThread);

  return Promise.all([
    createThreadNotificationEmail(
      signedThread,
      signedRecipientsWithoutMentions
    ), // handle emails separately
    slackNotificationPromise,
  ]).catch(err => {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
    console.error(err);
  });
};
