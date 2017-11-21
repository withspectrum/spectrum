// @flow
import { getUserById } from '../../models/user';
import { getThread } from '../../models/thread';
import { getCommunityById } from '../../models/community';
import { getChannelById } from '../../models/channel';
import { addQueue } from '../workerQueue';
import type { DBMessage } from 'shared/types';
import { toState, toPlainText } from 'shared/draft-utils';
import getSpectrumScore from './spectrum';
import getPerspectiveScore from './perspective';

export default async (message: DBMessage) => {
  const text =
    message.messageType === 'draftjs'
      ? toPlainText(toState(JSON.parse(message.content.body)))
      : message.content.body;

  const [spectrumScore, perspectiveScore] = await Promise.all([
    getSpectrumScore(text, message.id),
    getPerspectiveScore(text),
  ]);

  // if neither models returned results
  if (!spectrumScore && !perspectiveScore) return;

  const [user, thread] = await Promise.all([
    getUserById(message.senderId),
    getThread(message.threadId),
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
