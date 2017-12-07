// @flow
const debug = require('debug')('athena:queue:channel-notification');
import { getUserById } from '../../models/user';
import { getThreadById } from '../../models/thread';
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import { addQueue } from '../../utils/addQueue';
import type { DBMessage } from 'shared/types';
import { toState, toPlainText } from 'shared/draft-utils';
import getSpectrumScore from './spectrum';
import getPerspectiveScore from './perspective';

type JobData = {
  data: {
    message: DBMessage,
  },
};
export default async (job: JobData) => {
  debug('new job for admin message moderation');
  const { data: { message } } = job;

  const text =
    message.messageType === 'draftjs'
      ? toPlainText(toState(JSON.parse(message.content.body)))
      : message.content.body;

  const [spectrumScore, perspectiveScore] = await Promise.all([
    getSpectrumScore(text, message.id),
    getPerspectiveScore(text),
  ]).catch(err =>
    console.log('Error getting message moderation scores from providers', err)
  );

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

  try {
    return addQueue('admin toxic content email', {
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
  } catch (err) {
    console.log('\n\nerror getting message toxicity', err);
    return;
  }
};
