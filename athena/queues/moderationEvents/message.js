// @flow
const debug = require('debug')('athena:queue:channel-notification');
import { getUserById } from '../../models/user';
import { getThreadById } from '../../models/thread';
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import type { DBMessage } from 'shared/types';
import { toState, toPlainText } from 'shared/draft-utils';
import getSpectrumScore from './spectrum';
import getPerspectiveScore from './perspective';
import { _adminSendToxicContentEmailQueue } from 'shared/bull/queues';
import type { Job, AdminToxicMessageJobData } from 'shared/bull/types';

export default async (job: Job<AdminToxicMessageJobData>) => {
  debug('new job for admin message moderation');
  const { data: { message } } = job;

  const text =
    message.messageType === 'draftjs'
      ? toPlainText(toState(JSON.parse(message.content.body)))
      : message.content.body;

  const scores = await Promise.all([
    getSpectrumScore(text, message.id, message.senderId),
    getPerspectiveScore(text),
  ]).catch(err =>
    console.log('Error getting message moderation scores from providers', err)
  );

  const spectrumScore = scores && scores[0];
  const perspectiveScore = scores && scores[1];

  // if neither models returned results
  if (!spectrumScore && !perspectiveScore) return;

  const [user, thread] = await Promise.all([
    getUserById(message.senderId),
    getThreadById(message.threadId),
  ]);

  const [community, channel] = await Promise.all([
    getCommunityById(thread.communityId),
    getChannelById(thread.channelId),
  ]);

  return _adminSendToxicContentEmailQueue.add({
    type: 'message',
    text,
    user,
    thread,
    community,
    channel,
    toxicityConfidence: {
      spectrumScore,
      perspectiveScore,
    },
  });
};
